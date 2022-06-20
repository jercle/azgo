import { Command, Flags } from '@oclif/core'

// import getAllContainerRepositories from "../../funcs/getAllContainerRepositories.js"

export default class Acr extends Command {
  static description = 'Azure Container Registry related actions and data aggregations'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    acrRegistry: Flags.string({
      char: 'r',
      description: 'ACR registry to use',
      env: 'AZGO_ACR_REGISTRY',
      required: true
    })
  }

  static args = []

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Acr)

    // const data = getAllContainerRepositories()
  }
}
