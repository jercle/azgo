import { Flags } from '@oclif/core'

import BaseCommand from './baseCommand.js';
import { DefaultAzureCredential } from '@azure/identity';

import listSubscriptions from "./funcs/listSubscriptions.js"
import { showDebug } from './funcs/azgoUtils.js'
import baseCommand from './baseCommand.js';

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
    if (!flags.subscriptionId) {
      flags.subscriptionId = this.activeSubscription
    }
    // console.log(flags)
    baseCommand.flags = flags

    if (flags.debug) {
      await showDebug(flags, this.config)
      process.exit()
    }

    // const subCacheDir = `${this.config.cacheDir}/${flags.subscriptionId}`


  }
}
