import { Flags } from '@oclif/core';
import BaseCommand from './baseCommand.js';
import { DefaultAzureCredential } from '@azure/identity';
import listSubscriptions from "./funcs/listSubscriptions.js";
import { showDebug } from './funcs/azgoUtils.js';
import baseCommand from './baseCommand.js';
import { cacheExists, getCache, setCache } from './funcs/azgoCaching.js';
class default_1 extends BaseCommand {
    constructor() {
        super(...arguments);
        // subscriptions = listSubscriptions()
        // activeSubscription = this.subscriptions.default.subscriptionId
        this.activeSubscription = listSubscriptions().default.subscriptionId;
    }
    async init() {
        let { flags } = await this.parse(this.constructor);
        if (!flags.subscriptionId) {
            flags.subscriptionId = this.activeSubscription;
        }
        // console.log(flags)
        baseCommand.flags = flags;
        if (flags.debug) {
            await showDebug(flags, this.config);
            process.exit();
        }
        // const subCacheDir = `${this.config.cacheDir}/${flags.subscriptionId}`
    }
}
default_1.azCliCredential = new DefaultAzureCredential();
default_1.subscriptions = listSubscriptions();
default_1.getCache = getCache;
// cacheFileName: string,
// subscriptionId: string,
// cacheDir: string
default_1.setCache = setCache;
default_1.cacheExists = cacheExists;
// static flags = {
//   loglevel: Flags.string({options: ['error', 'warn', 'info', 'debug']})
// }
default_1.flags = {};
default_1.baseFlags = {
    ...BaseCommand.baseFlags,
    subscriptionId: Flags.string({
        char: 's',
        description: `
      Subscription ID to use.
      If not supplied, will use current active Azure CLI subscription.`,
        helpGroup: 'Global Azure',
    }),
};
export default default_1;
