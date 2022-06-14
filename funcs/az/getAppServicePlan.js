/**
 * Gets information related to an app's App Service Plan
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { WebSiteManagementClient } = require('@azure/arm-appservice');

async function getAppServicePlan(
  { appName, appEnv, subscriptionId },
  azCliCredential
) {
  const wsMgtClient = new WebSiteManagementClient(
    azCliCredential,
    subscriptionId
  );

  const env = () => {
    switch (appEnv) {
      case 'dev':
        return 'nonprod-dev';
        break;
      case 'test':
        return 'nonprod-test';
        break;
      case 'prod':
        return 'prod';
        break;
    }
  };

  let asp = await wsMgtClient.appServicePlans.get(
    `DMZ-${env()}-${appName}-RG`,
    `DMZ-${env()}-${appName}-ASP`
  );

  console.log(JSON.stringify(asp, null, 2));
}

module.exports = getAppServicePlan;
// getAppServicePlan({ appName: 'auchd', appEnv: 'dev' });
