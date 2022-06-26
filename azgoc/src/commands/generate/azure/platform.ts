import { Command, Flags } from '@oclif/core'
import { readFileSync } from 'fs'
// import { parse, stringify } from 'yaml'
import { homedir } from 'os';

const activeSubscription = JSON.parse(readFileSync(`${homedir()}/.azure/azureProfile.json`).toString().trim()).subscriptions.filter(sub => sub.isDefault)[0]

export default class GenerateAzurePlatform extends Command {
  static description = 'Create Azure pipeline and armconfig files from template'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'Name of application',
      env: 'AZGO_APP_NAME',
      required: true
    }),
    subscriptionId: Flags.string({
      char: 's',
      description: `
      Subscription ID to use.
      If not supplied, will use current active Azure CLI subscription.`,
      default: activeSubscription.id
    }),
    appEnvironemnts: Flags.string({
      char: 'e',
      description: `Comma separated list of application environments to build.
      Eg: dev,prod
      At least one is required as this creates the pipeline and
      variable files per environment provided`,
      env: 'AZGO_APP_ENVS',
      required: true
    }),
    baseName: Flags.string({
      char: 'b',
      description: `Base name of the application.
      Eg: "DMZ" or "PROD".
      Creates naming convention of <baseName>-<envName>-<subEnv>-<appName>
      If not specified, will be left out of the resource names`,
      env: 'AZGO_BASE_NAME'
    }),
    subEnvironments: Flags.string({
      char: 'd',
      description: `Sub Environment of the application.
      Eg: "NonProd" or "Prod".
      Can be used for creating names such as:
      Web-NonProd-Dev-AppName
      Web-NonProd-Test-AppName
      Web-Prod-Prod-AppName
      Creates naming convention of <baseName>-<envName>-<subEnv>-<appName>
      If not specified, will be left out of the resource names`,
      env: 'AZGO_SUB_ENVS'
    }),
    ignoreDuplicates: Flags.boolean({
      char: 'i',
      description: `Ignore duplicate names
      Eg: 'Web-Prod-Prod-AppName' would become 'Web-Prod-AppName'`,
    })
  }

  static args = []

  public async run(): Promise<void> {

    console.log('Currently not functional')
  }
}
