/**
* Saves cache to local cache dir.
*
* @param {string} cacheFileName - Name of the cache file to set
* @param {object} data - Data to cache
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns void
*
*/
export declare function setCache(cacheFileName: string, data: Object, subscriptionId: string, cacheDir?: string): void;
/**
* Gets cached from local cache file
*
* @param {string} cacheFileName - Name of the cache file to set
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns object
*
*/
export declare function getCache(cacheFileName: string, subscriptionId: string, cacheDir?: string): any;
/**
* Checks to see if cache exist for given type:
*
* 'repositories', 'containerRegsitries', 'subAssessments', etc
*
* @param {string} cacheFileName - Name of the cache file to check
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns object
*
*/
export declare function cacheExists(cacheFileName: string, subscriptionId: string, cacheDir?: string): boolean;
/**
* Initializes the app cache directory
*
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns void
*
*/
export declare function initCache(cacheDir: string, subscriptionId: string): void;
export declare function checkCache(opts: any, azCliCredential: any, config: any, filter?: any): any;
