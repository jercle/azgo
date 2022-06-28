import { readFileSync, writeFileSync, existsSync } from 'fs'
import { homedir } from 'os';
import { CliUx } from '@oclif/core'

import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'


import { DefaultAzureCredential } from '@azure/identity'
import { formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'
import inquirer from 'inquirer'

import { vulnerabilityFilter, uploadToMongoDatabase, showDebug, checkCache } from '../../funcs/azgoUtils.js'

import {
  transformVulnerabilityData,
  groupByAttribute,
  getAllUniqueCves,
  countByAttribute
} from '../../funcs/azureVulnarabilityAggregation.js'

const azCliCredential = new DefaultAzureCredential()

const activeSubscription = JSON.parse(readFileSync(`${homedir()}/.azure/azureProfile.json`)
  .toString()
  .trim())
  .subscriptions
  .filter(sub => sub.isDefault)[0]

export default class AcrVulns extends Command {
  static description = 'Get all vulnerabilities related to container images'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    subscriptionId: Flags.string({
      char: 's',
      description: `
      Subscription ID to use.
      If not supplied, will use current active Azure CLI subscription.`,
      default: activeSubscription.id
    }),
    resourceGroup: Flags.string({
      char: 'r',
      description: `
      Resource Group associate with the ACR
      If not supplied, will attempt to acquire from ACR's ID string`,
      env: 'AZGO_RESOURCE_GROUP'
    }),
    acrRegistry: Flags.string({
      char: 'a',
      description: `
      Name of the ACR.
      If not supplied, will select ACR in the subscription, or list them if there are multiple`,
      env: 'AZGO_ACR_REGISTRY'
    }),
    outfile: Flags.string({
      char: 'o',
      description: 'Save output to file',
      env: 'AZGO_SAVE_FILE',
    }),
    resyncData: Flags.boolean({
      description: 'Resync data from Azure to cache, and optionally (with -U) upload to MongoDB',
    }),
    groupBy: Flags.string({
      char: 'g',
      description: `Only display counts of vulnerabilities, grouped by provided countByAttribute
      Possible attributes include:
      repository: Group by repository name
      category: Can group by values such as 'Windows', 'Ubuntu', 'Debian', etc.
      severity: Severity of vulnerability, such as 'High', 'Medium', 'Low', etc.
      patchable: Whether or not the vulnerability is patchable
      os: Operating System of affected container. e.g. 'Windows', 'Linux'
      osDetails: Operating System details, e.g. 'Windows Server 2016', 'Ubuntu 16.04', etc.
      imageDigest: Group by image digest
      cve: Groups by CVE
      byRepoUnderCve: Groups by CVE, then by repository name. Example:
      ${chalk.dim(`...},
      'CVE-2022-32230': {
        repo1: [ [Object] ],
        repo2: [ [Object], [Object] ],
        repo3: [ [Object], [Object], [Object], [Object], [Object] ]
      },
      'CVE-2022-30131': {
        ...`)}
      `,
      options: [
        'repository', 'category', 'severity', 'patchable', 'os', 'osDetails', 'imageDigest', 'cve', 'byRepoUnderCve'
      ],
      summary: 'Group CVEs by provided attribute'
    }),
    filter: Flags.string({
      char: 'f',
      description: `Fiter results to specific attribute values
      Example: 'severity:high,medium', 'os:linux', patchable:true`,
      multiple: true,
      default: []
    }),
    showCounts: Flags.boolean({
      char: 'c',
      summary: "Show counts of vulnerabilities only, no detailed information.",
      description: `Show counts of vulnerabilities only, no detailed information.

      Note: Detailed information will still be output to file if the --detailedOutput -d flag is used

      ${chalk.underline(chalk.yellow("Note: This flag does not currently function when grouping 'byRepoUnderCve'"))}`,
    }),
    detailedOutput: Flags.boolean({
      char: 'd',
      description: "When used with the --showCounts -c flag, saves detailed information to output file instead of just counts",
      dependsOn: ['showCounts', 'outfile']
    }),
    formatTable: Flags.boolean({
      char: 'T',
      description: "Format output as a table",
      dependsOn: ['showCounts'],
      exclusive: ['detailedOutput']
    }),
    formatCsv: Flags.boolean({
      char: "C",
      description: "Show output as CSV",
      dependsOn: ['showCounts'],
      exclusive: ['detailedOutput']
    }),
    listAllCves: Flags.boolean({
      char: 'l',
      description: "List all CVEs found in assessed ACR",
      exclusive: ['showCounts', 'groupBy', 'detailedOutput']
    }),
    uploadToDb: Flags.boolean({
      char: "U",
      description: "Upload to MongoDB Database"
      // dependsOn: ['showCounts'],
      // exclusive: ['detailedOutput']
    }),
    dbConnectionString: Flags.string({
      char: "S",
      description: "Connection string for Database",
      env: 'AZGO_DB_CONNECTION_STRING'
      // dependsOn: ['uploadToDb'],
      // exclusive: ['uploadToDb']
    }),
    debug: Flags.boolean({
      description: "Testing only",
      hidden: true
    }),
  }
  // { acrRegistry, outfile, includeManifests, resyncData },
  // { assessmentId, subscriptionId, resourceGroup, acrRegistry, outfile, resyncData},
  static args = []

  public async run(): Promise<void> {
    const { flags } = await this.parse(AcrVulns)
    let opts = {
      includeManifests: true,
      assessmentId: "dbd0cb49-b563-45e7-9724-889e799fa648",
      acrRegistry: null,
      acrRegistryId: null,
      resourceGroup: null,
      assessmentsCache: existsSync(`${this.config.cacheDir}/assessments.json`),
      repositoriesCache: existsSync(`${this.config.cacheDir}/repositories.json`),
      ...flags
    }
    // console.log(opts)
    // const assessmentsCache = existsSync(`${this.config.cacheDir}/assessments.json`)
    // const repositoriesCache = existsSync(`${this.config.cacheDir}/repositories.json`)

    if (flags.debug) {
      showDebug(opts, this.config)
    }

    if (flags.showCounts && ((flags.groupBy &&
      flags.groupBy.toLowerCase() === 'byrepoundercve') ||
      flags.listAllCves)) {
      console.log(chalk.red('Currently unable to perform count on byRepoUnderCve or --listAllCves'))
      process.exit(1)
    }

    const registries = await getAllContainerRegistries(opts, azCliCredential)

    if (!opts.acrRegistry) {
      if (registries.length === 1) {
        opts.acrRegistry = registries[0].name
        opts.acrRegistryId = registries[0].id as string
        console.log(chalk.blue('1 ACR available on this subscription, which has been selected:', registries[0].name))
      } else if (registries.length > 1) {
        const acrRegistry = await inquirer.prompt({
          type: "list",
          name: "name",
          message: "Choose ACR Registry to use for this command",
          choices: registries,
        })
        opts.acrRegistry = acrRegistry.name
        opts.acrRegistryId = acrRegistry['id']
      }

      if (!opts.resourceGroup) {
        const resourceGroup = await inquirer.prompt({
          type: "confirm",
          name: "isCorrect",
          message: `${chalk.dim(`Attempted to automatically find resource group for selected ACR, ${opts.acrRegistry}.`)}
Is "${opts.acrRegistryId.split('/')[4]}" correct?`,
          default: true
        })

        if (resourceGroup.isCorrect) {
          opts.resourceGroup = opts.acrRegistryId.split('/')[4]
        } else {
          const response = await inquirer.prompt({
            type: "input",
            name: "rgName",
            message: "Enter resource group name",
          })
          opts.resourceGroup = response.rgName
        }
      }
    }

    // console.log(opts)


    const { assessments, repos } = checkCache(opts, azCliCredential)
    // console.log(repos)

    const formattedData = transformVulnerabilityData(assessments.subAssessments, repos.repositories)
    const filteredData = opts.filter.length > 0 ? vulnerabilityFilter(formattedData, opts.filter) : formattedData


    // // console.log(opts)
    // if (opts.uploadToDb) {
    //   opts.uploadToDb && uploadToMongoDatabase(formattedData, opts)
    // }

    if (opts.groupBy && opts.showCounts) {
      const result = countByAttribute(filteredData, opts.groupBy, "array")
      if (opts.formatTable || opts.formatCsv) {
        CliUx.ux.table(<any>result, {
          attr: {
            header: "Attribute"
          },
          count: {
          },
        }, {
          csv: flags.formatCsv,
        })
        // opts.outfile && writeFileSync(opts.outfile, table)
      } else {
        console.log(result)
      }
      opts.outfile && writeFileSync(opts.outfile, JSON.stringify(result, null, 2))
      opts.uploadToDb && uploadToMongoDatabase(formattedData, opts)
      process.exit()

    } else if (opts.showCounts) {
      console.log(`${chalk.yellow(filteredData.length)} total vulnerabilities`)
      opts.outfile && writeFileSync(opts.outfile, JSON.stringify(formattedData, null, 2))
      opts.uploadToDb && uploadToMongoDatabase(formattedData, opts)
      process.exit()

    } else if (opts.groupBy) {
      const result = groupByAttribute(filteredData, opts.groupBy)
      console.log(result)
      opts.outfile && writeFileSync(opts.outfile, JSON.stringify(result, null, 2))
      opts.uploadToDb && uploadToMongoDatabase(formattedData, opts)
      process.exit()

    } else if (opts.listAllCves) {
      const result = getAllUniqueCves(filteredData)
      console.log(result)
      opts.outfile && writeFileSync(opts.outfile, JSON.stringify(result, null, 2))
      opts.uploadToDb && uploadToMongoDatabase(formattedData, opts)
      process.exit()

    } else {
      // console.log(formattedData)
      opts.outfile && writeFileSync(opts.outfile, JSON.stringify(formattedData, null, 2))
      opts.uploadToDb && await uploadToMongoDatabase(formattedData, opts)
      process.exit()
    }



    // console.log(opts)


    // CliUx.ux.table(users, {
    //   name: {
    //     minWidth: 7,
    //   },
    //   company: {
    //     get: row => row.company && row.company.name
    //   },
    //   id: {
    //     header: 'ID',
    //     extended: true
    //   }
    // }, {
    // printLine: this.log,
    // ...flags, // parsed flags
    // })



    // CliUx.ux.table(users, {
    //   name: {
    //     minWidth: 7,
    //   },
    //   company: {
    //     get: row => row.company && row.company.name
    //   },
    //   id: {
    //     header: 'ID',
    //     extended: true
    //   }
    // }, {
    //   printLine: this.log,
    //   ...flags, // parsed flags
    // })


    // console.log(opts.outfile)
    // console.log(opts.outfile.replace('.', process.cwd()))
    // console.log(process.cwd())

    // console.log(opts)
    // console.log(countByAttribute(transformVulnerabilityData(data, repos), "osDetails", "object"))

    // console.log(result)

    // const transformedData = transformVulnerabilityData(assessments.subAssessments, repos.repositories)
    // console.log(transformedData)
    // const groupedByCve = groupByCve(transformedData)
    // console.log(groupedByCve)
    // console.log(Object.keys(groupedByCve))
    // transformedData.map(i => {
    //   console.log(i.imageTags)
    // })
    // const groupedByRepoUnderCve = groupByRepoUnderCve(transformedData)
    // console.log(groupedByRepoUnderCve)
    // console.log(JSON.stringify(groupedByRepoUnderCve, null, 2))
    // const groupedByTag
  }
}


// import {
//   transformVulnerabilityData,
//   getAllManifests,
//   groupByAttribute,
//   getAllUniqueCves,
//   groupByCve,
//   groupByRepoUnderCve,
//   countByAttribute
// } from '../../funcs/azureVulnarabilityAggregation.js'
