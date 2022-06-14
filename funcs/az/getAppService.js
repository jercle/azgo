/**
 * Get's current configuration of given App Service
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { DefaultAzureCredential } = require("@azure/identity")
const { WebSiteManagementClient } = require("@azure/arm-appservice")

async function getAppService(
  { appEnv, appName, subscriptionId },
  azCliCredential
) {
  const websiteManagementClient = new WebSiteManagementClient(
    azCliCredential,
    subscriptionId
  )

  const env = () => {
    switch (appEnv) {
      case "dev":
        return "nonprod-dev"
        break
      case "test":
        return "nonprod-test"
        break
      case "prod":
        return "prod"
        break
    }
  }

  const app = await websiteManagementClient.webApps.getConfiguration(
    `DMZ-${env()}-${appName}-RG`,
    `DMZ-${env()}-${appName}-site`
  )

  console.log(JSON.stringify(app, null, 2))
}

module.exports = getAppService

// getAppService(
//   {
//     appName: "ahdb",
//     appEnv: "dev",
//     subscriptionId: "23310d40-a0d5-4446-8433-d0e6b151c2ab",
//   },
//   new DefaultAzureCredential()
// )
