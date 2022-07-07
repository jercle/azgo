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
    organization: Flags.string({
      char: 'o',
      description: `Organization to use for Azure DevOps related commands
      NOTE: Can also be set using AZGO_DEVOPS_ORG environment variable`,
      helpGroup: 'Global Azure DevOps',
      env: 'AZGO_DEVOPS_ORG',
      required: true
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
