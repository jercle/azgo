/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

 const { DefaultAzureCredential } = require("@azure/identity")

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

__name__(opts, new DefaultAzureCredential())

 async function __name__({ appEnv, appName }, azCliCredential) {}

 module.exports = __name__
