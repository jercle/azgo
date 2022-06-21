import { Command, Flags } from '@oclif/core'

// import { writeFileSync } from 'fs'

// import getAllContainerRepositories from "../../funcs/getAllContainerRepositories.js"

import { DefaultAzureCredential } from '@azure/identity'
import { formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'

import getAllContainerRepositories from '../../funcs/getAllContainerRepositories.js'

const azCliCredential = new DefaultAzureCredential()

export default class AcrVulns extends Command {
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
    saveFile: Flags.string({
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
    const { args, flags } = await this.parse(AcrVulns)
    // console.log(flags)
    // console.log(this.config)
    // const data = getAllContainerRepositories(flags, "azCliCredential")
    // const dateLeft = parseISO("2022-06-20T18:32:57+10:00")
    // const dateRight = parseISO("2013-06-10T18:32:57+10:00")

    // console.log(formatISO(new Date()))

    const vulnData = await getAllContainerRepositories(flags, azCliCredential)

    // console.log(differenceInHours(new Date(), parseISO(vulnData.azgoSyncDate)))
    // console.log(repos)
  }
}
