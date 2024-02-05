import BaseCommand from './baseCommand.js';
import { DefaultAzureCredential } from '@azure/identity';
import { cacheExists, getCache, setCache } from './funcs/azgoCaching.js';
export default abstract class extends BaseCommand {
    static azCliCredential: DefaultAzureCredential;
    static subscriptions: any;
    static getCache: typeof getCache;
    static setCache: typeof setCache;
    static cacheExists: typeof cacheExists;
    activeSubscription: any;
    static flags: {};
    static baseFlags: {
        subscriptionId: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        debug: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    init(): Promise<void>;
}
