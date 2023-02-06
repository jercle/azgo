import { Command, Flags, CliUx } from '@oclif/core'
import AzureCommand from "../../../baseAzure.js"

// import { writeFileSync } from 'fs'

// import getAllContainerRepositories from "../../funcs/getAllContainerRepositories.js"

import { DefaultAzureCredential } from '@azure/identity'
import { formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'

import getAllContainerRepositories from '../../../funcs/getAllContainerRepositories.js'
import { cacheExists, checkCache, getCache, setCache } from '../../../funcs/azgoCaching.js'

const azCliCredential = new DefaultAzureCredential()

export default class AcrReposList extends AzureCommand {
  static description = 'Get all container vulnerabilities'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    acrRegistry: Flags.string({
      char: 'a',
      description: 'ACR registry to use',
      env: 'AZGO_ACR_REGISTRY',
      required: true
    }),
    outfile: Flags.string({
      char: 'o',
      description: 'Save output to file',
      env: 'AZGO_SAVE_FILE'
    }),
    includeManifests: Flags.boolean({
      char: 'm',
      description: 'Include manifests in output',
      env: 'AZGO_INCLUDE_MANIFESTS',
    }),
    resyncData: Flags.boolean({
      char: 'r',
      description: 'Resync data from Azure',
    })
  }

  // { acrRegistry, outfile, includeManifests, resyncData, subscriptionId, }

  static args = []

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AcrReposList)
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

    let repos
    if (cacheExists('acrRepoList', this.activeSubscription) && !flags.resyncData) {
      this.log('Loading cached data from file...')
      repos = getCache('acrRepoList', this.activeSubscription)
    } else {
      this.log('Loading data from Azure...')
      repos = await getAllContainerRepositories(opts, azCliCredential)
      setCache('acrRepoList', repos, this.activeSubscription)
    }
    console.log(repos)
    return repos

    // repos.repositories.map(repo => {
    //   const manifests = repo.manifests ? repo.manifests.length : 0
    //   console.log({
    //     name: repo.name,
    //     manifests
    //   })
    // })
    // TODO: Print table view: https://oclif.io/docs/table
  }
}
