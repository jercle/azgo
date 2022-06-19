import {Command, Flags} from '@oclif/core'
import listSubscriptions from "../funcs/listSubscriptions"
import selectActiveSubscription from "../funcs/selectActiveSubscription"

export default class Subs extends Command {
  static description = 'Display current configured Azure CLI subscriptions'

  static examples = [
    'azgoc subs',
    'azgoc subs --setActive'
  ]

  static flags = {
    // TODO: "showActive": Flags.boolean({char: 'a'}),
    "setActive": Flags.boolean({char: 's', description: "Set active subscription for Azure CLI"}),
  }

  static args = []

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Subs)
    flags.setActive ? selectActiveSubscription() : console.log(await listSubscriptions())
  }
}
