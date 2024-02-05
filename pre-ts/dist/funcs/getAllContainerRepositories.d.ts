/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */
export default function getAllContainerRepositories({ acrRegistry, outfile, includeManifests, resyncData, subscriptionId, }: {
    acrRegistry: any;
    outfile: any;
    includeManifests: any;
    resyncData: any;
    subscriptionId: any;
}, azCliCredential: any): Promise<{
    azgoSyncDate: string;
    data: any[];
}>;
