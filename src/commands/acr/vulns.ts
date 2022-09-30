import { readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os';

import { DefaultAzureCredential } from '@azure/identity'

import { CliUx, Flags } from '@oclif/core'
import AzureCommand from "../../baseAzure.js"


import chalk from 'chalk'
import inquirer from 'inquirer'

import {
  vulnerabilityFilter,
  uploadToMongoDatabase,
} from '../../funcs/azgoUtils.js'

import getAllContainerRegistries from '../../funcs/dev-getAllContainerRegistries.js'
import getAllContainerRepositories from '../../funcs/getAllContainerRepositories.js'
import getSubAssessments from '../../funcs/getSubAssessments.js'

import { checkCache, cacheExists, getCache, setCache } from '../../funcs/azgoCaching.js'

import {
  transformVulnerabilityData,
  groupByAttribute,
  getAllUniqueCves,
  countByAttribute
} from '../../funcs/azureVulnarabilityAggregation.js'

type returnedData = {
  azgoSyncDate: string,
  data: any,
}


// const activeSubscription = JSON.parse(readFileSync(`${homedir()}/.azure/azureProfile.json`)
//   .toString()
//   .trim())
//   .subscriptions
//   .filter(sub => sub.isDefault)[0]

export default class AcrVulns extends AzureCommand {
  static description = 'Get all vulnerabilities related to container images'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
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
    // debug: Flags.boolean({
    //   description: "Testing only",
    //   hidden: true
    // }),
  }
  // { acrRegistry, outfile, includeManifests, resyncData },
  // { assessmentId, subscriptionId, resourceGroup, acrRegistry, outfile, resyncData},
  static args = []

  public async run(): Promise<void> {
    const { flags } = await this.parse(AcrVulns)
    const azCliCredential = new DefaultAzureCredential()
    let opts = {
      subscriptionId: this.activeSubscription,
      includeManifests: true,
      assessmentId: "dbd0cb49-b563-45e7-9724-889e799fa648",
      acrRegistry: null,
      debug: null,
      acrRegistryId: null,
      resourceGroup: null,
      ...flags
    }

    // console.log(opts)

    // if (opts.debug) {
    //   console.log('debug')
    //   // await showDebug(opts, this.config)
    //   await showDebug(opts, this.config)
    //   process.exit()
    // }

    if (flags.showCounts && ((flags.groupBy &&
      flags.groupBy.toLowerCase() === 'byrepoundercve') ||
      flags.listAllCves)) {
      console.log(chalk.red('Currently unable to perform count on byRepoUnderCve or --listAllCves'))
      process.exit(1)
    }

    // console.log(cacheExists('containerRegistries', opts.subscriptionId, this.config.cacheDir))


    const containerRegsitries = cacheExists('getAllContainerRegistries', opts.subscriptionId, this.config.cacheDir) ?
      getCache('containerRegistries', opts.subscriptionId, this.config.cacheDir)
      : await getAllContainerRegistries(opts, azCliCredential)
    // console.log(testing)
    // console.log(containerRegsitries)
    // console.log(cacheExists('getAllContainerRegistries', opts.subscriptionId, this.config.cacheDir))
    // process.exit()
    // checkCache(opts, azCliCredential, this.config, 'containerRegsitries')
    // const containerRegsitries = checkCache(opts, azCliCredential, this.config, 'containerRegsitries')


    if (!opts.acrRegistry) {
      if (containerRegsitries.length === 1) {
        opts.acrRegistry = containerRegsitries[0].name
        opts.acrRegistryId = containerRegsitries[0].id as string
        console.log(chalk.blue('1 ACR available on this subscription, which has been selected:', containerRegsitries[0].name))
      } else if (containerRegsitries.length > 1) {
        const acrRegistry = await inquirer.prompt({
          type: "list",
          name: "name",
          message: "Choose ACR Registry to use for this command",
          choices: containerRegsitries,
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

    let assessments: returnedData
    let repositories: returnedData

    // this.exit()



    if (opts.resyncData) {
      // console.log('resync - true')
      assessments = await getSubAssessments(opts, azCliCredential)
      setCache('getsubAssessments', assessments, opts.subscriptionId)
      repositories = await getAllContainerRepositories(opts, azCliCredential)
      setCache('getAllContainerRepositories', repositories, opts.subscriptionId)
    } else {
      // console.log('resync - false')
      // console.log(cacheExists('getsubAssessments', opts.subscriptionId))
      assessments = cacheExists('getsubAssessments', opts.subscriptionId) ?
        getCache('getsubAssessments', opts.subscriptionId)
        : await getSubAssessments(opts, azCliCredential)
      repositories = cacheExists('getAllContainerRepositories', opts.subscriptionId) ?
        getCache('getAllContainerRepositories', opts.subscriptionId)
        : await getAllContainerRepositories(opts, azCliCredential)
    }

    // console.log(assessments)

    // this.exit()

    // setCache('assessments', assessments, opts.subscriptionId, this.config.cacheDir)
    // setCache('repositories', repositories, opts.subscriptionId, this.config.cacheDir)

    // console.log(assessments.data.length)
    // console.log(repositories.data.length)
    // process.exit()
    // const { assessments, repos } = await checkCache(opts, azCliCredential, this.config)


    const formattedData = transformVulnerabilityData(assessments.data, repositories.data)
    const filteredData = opts.filter.length > 0 ?
      vulnerabilityFilter(formattedData, opts.filter) :
      formattedData

    // console.log(formattedData.length)


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
      console.log(formattedData)
      opts.outfile && writeFileSync(opts.outfile, JSON.stringify(formattedData, null, 2))
      opts.uploadToDb && await uploadToMongoDatabase(formattedData, opts)
      process.exit()
    }
  }
}
