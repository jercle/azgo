import { Flags } from '@oclif/core'

import BaseCommand from './baseCommand.js';
import { DefaultAzureCredential } from '@azure/identity';

import listSubscriptions from "./funcs/listSubscriptions.js"
import { showDebug } from './funcs/azgoUtils.js'

export default abstract class extends BaseCommand {
  static azCliCredential = new DefaultAzureCredential()
  static subscriptions = listSubscriptions()
  // subscriptions = listSubscriptions()
  // activeSubscription = this.subscriptions.default.subscriptionId
  activeSubscription = listSubscriptions().default.subscriptionId

  // static flags = {
  //   loglevel: Flags.string({options: ['error', 'warn', 'info', 'debug']})
  // }

  static flags = {}

  static globalFlags = {
    ...BaseCommand.globalFlags,
    subscriptionId: Flags.string({
      char: 's',
      description: `
      Subscription ID to use.
      If not supplied, will use current active Azure CLI subscription.`,
      helpGroup: 'Global Azure',
    }),
  };

  async init() {
    let { flags } = await this.parse(<any>this.constructor)
    if (flags.debug) {
      flags.subscriptionId = this.activeSubscription
      await showDebug(flags, this.config)
      // console.log(this.config)
      process.exit()
    }
  }
}
