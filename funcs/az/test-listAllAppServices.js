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
  subscriptionId: process.env.subscriptionId,
  resourceGroup: process.env.resourceGroup,
  acrName: process.env.acrName,
  assessmentName: process.env.assessmentName,
  nsgName: process.env.nsgName,
  acrRegistry: process.env.acrRegistry,
  testDataPath: process.env.testDataPath
}
// {
//   subscriptionId,
//   resourceGroup,
//   acrName,
//   assessmentName,
//   nsgName,
//   acrRegistry,
//   testDataPath,
// }


listAllAppServices(opts, new DefaultAzureCredential())

async function listAllAppServices({ subscriptionId }) {
  const client = new WebSiteManagementClient(
    new DefaultAzureCredential(),
    subscriptionId.nonprod
  )

  let allAppServices = []
  const apps = await client.webApps.list()

  for await (const app of apps) {
    allAppServices = [...allAppServices, app]
  }
  // writeFileSync(
  //   "../testData/allAppServices.json",
  //   JSON.stringify(allAppServices)
  // )
  // const allAppServices = JSON.parse(
  //   readFileSync("../testData/allAppServices.json")
  // )

  // console.log(
  //   JSON.stringify(
  //     allAppServices.filter((app) => app.name.toLowerCase().includes("ahpl"))
  //   )
  // )
  console.log(
    allAppServices.filter((app) => app.name.toLowerCase().includes("aahr"))
  )
  // console.log(JSON.stringify(allAppServices.filter((app) => !app.identity)))
  //////////////////////
  let formattedAppServices = allAppServices.map((app) => {
    const image = (
      app.siteConfig.windowsFxVersion || app.siteConfig.linuxFxVersion
    )
      .split("/")
      .at(-1)
    const principalId = app.identity ? app.identity.principalId : null

    let appService = {
      id: app.id,
      name: app.name,
      image,
      kind: app.kind,
      principalId,
      appServicePlan: app.serverFarmId,
      reserved: app.reserved,
      hyperV: app.hyperV,
      resourceGroup: app.resourceGroup,
      subnet: app.virtualNetworkSubnetId,
    }

    app.hostNames.forEach((hostname, i) => {
      if (i == 0) {
        appService.hostname = hostname
      } else {
        appService[`hostName${i + 1}`] = hostname
      }
    })

    return appService
  })
  ///////////////
  console.log(JSON.stringify(formattedAppServices))
  console.log(
    formattedAppServices.filter((item) =>
      item.name.toLowerCase().includes("aahr")
    )
  )
  // formattedAppServices.map((app) => app.image && console.log(app.image))
}

module.exports = listAllAppServices
