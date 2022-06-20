import { Command, Flags } from '@oclif/core'

import getAllContainerRepositories from "../../funcs/getAllContainerRepositories.js"

export default class AcrVulns extends Command {
  static description = 'Get all container vulnerabilities'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    acrRegistry: Flags.string({
      char: 'r',
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
      env: 'AZGO_INCLUDE_MANIFESTS'
    }),
  }

  static args = []

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AcrVulns)
    console.log(flags)
    // const data = getAllContainerRepositories(flags, "azCliCredential")

  }
}
