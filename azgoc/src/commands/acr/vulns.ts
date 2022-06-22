import { Command, Flags } from '@oclif/core'

import { readFileSync, writeFileSync } from 'fs'
// import * as os from 'os';
import { homedir } from 'os';

// import getAllContainerRepositories from "../../funcs/getAllContainerRepositories.js"

import { DefaultAzureCredential } from '@azure/identity'
import { formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'

import getAllContainerRepositories from '../../funcs/getAllContainerRepositories.js'
// import aggregateReposAndAssessments from '../../funcs/dev-aggregateReposAndAssessments.js'

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
    acrRegistry: Flags.string({
      char: 'r',
      description: 'ACR registry to use',
      env: 'AZGO_ACR_REGISTRY',
      required: true
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
    const opts = {
      includeManifests: true,
      assessmentId: "dbd0cb49-b563-45e7-9724-889e799fa648",
      ...flags
    }

    console.log(opts)
    // const repos = await getAllContainerRepositories(opts, azCliCredential)
    // const assessments = await
    // const aggregatedData = await aggregateReposAndAssessments(opts, azCliCredential)
    // console.log(aggregatedData)
  }
}
