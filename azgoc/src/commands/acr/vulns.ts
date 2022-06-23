import { readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os';

import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'

// import getAllContainerRepositories from "../../funcs/getAllContainerRepositories.js"

import { DefaultAzureCredential } from '@azure/identity'
import { formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'

import getAllContainerRepositories from '../../funcs/getAllContainerRepositories.js'
import getAllContainerRegistries from '../../funcs/dev-getAllContainerRegistries.js'
import getSubAssessments from '../../funcs/getSubAssessments.js'
import inquirer from 'inquirer'

import {
  transformVulnerabilityData,
  getAllManifests,
  groupByAttribute,
  getAllUniqueCves,
  groupByCve,
  groupByRepoUnderCve,
  countByAttribute
} from '../../funcs/azureVulnarabilityAggregation.js'

const azCliCredential = new DefaultAzureCredential()

const activeSubscription = JSON.parse(readFileSync(`${homedir()}/.azure/azureProfile.json`)
  .toString()
  .trim())
  .subscriptions
  .filter(sub => sub.isDefault)[0]

export default class AcrVulns extends Command {
  static description = 'Get all container vulnerabilities'

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
      char: 'g',
      description: 'Resource Group of the ACR',
      env: 'AZGO_RESOURCE_GROUP',
      required: true
    }),
    saveFile: Flags.string({
      char: 'o',
      description: 'Save output to file',
      env: 'AZGO_SAVE_FILE'
    }),
    resyncData: Flags.boolean({
      char: 'r',
      description: 'Resync data from Azure',
    })
  }
  // { acrRegistry, saveFile, includeManifests, resyncData },
  // { assessmentId, subscriptionId, resourceGroup, acrRegistry, saveFile, resyncData},
  static args = []

  public async run(): Promise<void> {
    const { flags } = await this.parse(AcrVulns)
    let opts = {
      includeManifests: true,
      assessmentId: "dbd0cb49-b563-45e7-9724-889e799fa648",
      acrRegistry: null,
      ...flags
    }

    const registries = await getAllContainerRegistries(opts, azCliCredential)
    // console.log(registries.length)

    if (registries.length === 1) {
      opts.acrRegistry = registries[0].name
      console.log(chalk.blue('1 ACR available on this subscription, which has been selected:', registries[0].name))
    } else if (registries.length > 1) {
      const acrRegistry = await inquirer.prompt({
        type: "list",
        name: "name",
        message: "Choose ACR Registry to use for this command",
        choices: registries,
      })
      opts.acrRegistry = acrRegistry.name
    }

    // console.log(opts)
    const assessments = await getSubAssessments(opts, azCliCredential)
    // console.log(assessments)
    const repos = await getAllContainerRepositories(opts, azCliCredential)
    // console.log(repos)

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
