import { Command, Flags, CliUx } from '@oclif/core'

// import { writeFileSync } from 'fs'

// import getAllContainerRepositories from "../../funcs/getAllContainerRepositories.js"

import { DefaultAzureCredential } from '@azure/identity'
import { formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'

import getAllContainerRepositories from '../../../funcs/getAllContainerRepositories.js'

const azCliCredential = new DefaultAzureCredential()

export default class AcrReposList extends Command {
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

  static args = []

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AcrReposList)
    // const repos = await getAllContainerRepositories(flags, azCliCredential)
    // console.log(repos)
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
