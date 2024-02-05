import {Args, Command, Flags} from '@oclif/core'

import AzureCommand from "../baseAzure.js"

import selectActiveSubscription from "../funcs/selectActiveSubscription.js"
import { checkCache } from '../funcs/azgoCaching.js'

export default class Subs extends AzureCommand {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    ...AzureCommand.flags,
    "showActive": Flags.boolean({
      char: 'a',
      exclusive: ['setActive'],
      description: "Show current active subscription for Azure CLI"
    }),
    "setActive": Flags.boolean({
      char: 'x',
      description: "Set active subscription for Azure CLI",
      exclusive: ['showActive']
    }),
  }

  static args = {
    file: Args.string({description: 'file to read'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Subs)

    const subs = await Subs.subscriptions
    if (flags.showActive) {
      console.log(subs.default)
      process.exit()
    }
    flags.setActive ? selectActiveSubscription() : console.log(subs.all)
  }
}
