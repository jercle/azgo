import { Flags } from '@oclif/core'

import BaseCommand from './baseCommand.js';
import { DefaultAzureCredential } from '@azure/identity';

import { cacheExists, getCache, setCache } from './funcs/azgoCaching.js'
import listSubscriptions from "./funcs/listSubscriptions.js"
import { showDebug } from './funcs/azgoUtils.js'
import baseCommand from './baseCommand.js';

export default abstract class extends BaseCommand {
  static azCliCredential = new DefaultAzureCredential()
  subscriptions = listSubscriptions()
  // subscriptions = listSubscriptions()
  // activeSubscription = this.subscriptions.default.subscriptionId
  activeSubscription = listSubscriptions().default.subscriptionId

  static getCache = getCache
  // cacheFileName: string,
  // subscriptionId: string,
  // cacheDir: string

  static setCache = setCache
  static cacheExists = cacheExists

  // static flags = {
  //   loglevel: Flags.string({options: ['error', 'warn', 'info', 'debug']})
  // }

  static flags = {}

  static globalFlags = {
    ...BaseCommand.globalFlags,
    subscriptionId: Flags.string({
      description: `
      Subscription ID to use.
      If not supplied, will use current active Azure CLI subscription.
      Configurable with "azgo config devops defaultSub" command.`,
      helpGroup: 'Global Azure DevOps',
      env: 'AZGO_DEVOPS_SUBSCRIPTION_ID',
      // required: true
    }),
    organization: Flags.string({
      char: 'o',
      description: `Organization to use for Azure DevOps related commands
      NOTE: Can also be set using AZGO_DEVOPS_ORG environment variable`,
      // TODO: Configurable with "azgo config devops setOrg" command.`,
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
