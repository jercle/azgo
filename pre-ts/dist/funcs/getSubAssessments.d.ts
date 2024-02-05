/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */
export default function getsubAssessments({ assessmentId, subscriptionId, resourceGroup, acrRegistry, outfile, resyncData }: {
    assessmentId: any;
    subscriptionId: any;
    resourceGroup: any;
    acrRegistry: any;
    outfile: any;
    resyncData: any;
}, credentials: any): Promise<{
    azgoSyncDate: string;
    data: any[];
}>;
