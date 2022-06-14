/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { DefaultAzureCredential } = require("@azure/identity")
const { WebSiteManagementClient } = require("@azure/arm-appservice")
const { readFileSync, writeFileSync } = require("fs")

const opts = {
  acrRegistry: "",
  subscriptionId: {
    prod: "",
    nonprod: "",
  },
  appName: "",
  imageRetention: 30,
  appEnv: "dev",
}

getAppServiceDetails(opts, new DefaultAzureCredential())

async function getAppServiceDetails({ appName, appEnv, subscriptionId }) {
  const client = new WebSiteManagementClient(
    new DefaultAzureCredential(),
    subscriptionId.nonprod
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

  const resourceGroup = `dmz-${env()}-${appName}-rg`
  const siteName = `dmz-${env()}-${appName}-site`

  const app = await client.webApps.get(resourceGroup, siteName)
  // console.log(app)

  // const app = await client.webApps.getConfiguration(resourceGroup, siteName)
  const config = await client.webApps.listApplicationSettings(
    resourceGroup,
    siteName
  )
  app.principalId = app.identity ? app.identity.principalId : null

  app.slots = []
  for await (slot of await client.webApps.listSlots(resourceGroup, siteName)) {
    // console.log(JSON.stringify(slot))
    const principalId = slot.identity ? slot.identity.principalId : null
    let details = {
      id: slot.id,
      name: slot.name,
      principalId,
    }
    app.slots = [...app.slots, details]
  }
  console.log({
    name: app.name,
    id: app.id,
    principalId: app.principalId,
    slots: app.slots,
    config,
  })
  // console.log(app)
}

module.exports = getAppServiceDetails
