import { Args, Flags } from '@oclif/core'

import AzureDevOpsCommand from "../../../baseAzureDevOps.js"

import { selectActiveAzureDevOpsSubscription } from '../../../funcs/selectActiveSubscription.js'

import { initConfig } from '../../../funcs/azgoUtils.js'

export default class ConfigDevopsDefaultSub extends AzureDevOpsCommand {
  static description = 'Shows the default subscription for Azure DevOps'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --select',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    select: Flags.boolean({
      char: 's',
      description: 'Select the default subscription to be used by Azure DevOps commands from currently logged in Azure CLI subscriptions',
    })
    // name: Flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    // force: Flags.boolean({ char: 'f' }),
  }

  static args = {
    file: Args.string({decription: "file to read"})
   }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ConfigDevopsDefaultSub)

    process.env.XDG_CONFIG_HOME ? selectActiveAzureDevOpsSubscription(process.env.XDG_CONFIG_HOME) : selectActiveAzureDevOpsSubscription(this.config.configDir)

    // console.log(this.config)
    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from /Users/jercle/git/azgo/src/commands/config/devops/defaultSub.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }



    // if (process.env.XDG_CONFIG_HOME) {
    //   initConfig(process.env.XDG_CONFIG_HOME)
    //   // console.log('XDG_CONFIG_HOME')
    // } else {
    //   initConfig(this.config.configDir)
    //   // console.log('this.config.configDir')
    // }
  }
}
