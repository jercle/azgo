import { Flags } from '@oclif/core';
import BaseCommand from './baseCommand.js';
import { DefaultAzureCredential } from '@azure/identity';
import { cacheExists, getCache, setCache } from './funcs/azgoCaching.js';
import listSubscriptions from "./funcs/listSubscriptions.js";
import { showDebug } from './funcs/azgoUtils.js';
import baseCommand from './baseCommand.js';
class default_1 extends BaseCommand {
    constructor() {
        super(...arguments);
        this.subscriptions = listSubscriptions();
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
    user: Flags.string({
        char: 'u', description: `User's full name or Email address used for Azure DevOps login
    "John Smith" or "john.smith@org.com.au" to filter by assignment

    NOTE: If not provided, email address used with current active subscription will be used.
    This can be found or changed with the "azgo subs" command.`
    }),
};
export default default_1;
