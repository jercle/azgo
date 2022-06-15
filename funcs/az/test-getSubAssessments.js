/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { DefaultAzureCredential } = require("@azure/identity")
const { SecurityCenter } = require("@azure/arm-security")
const { writeFileSync } = require("fs")

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

getsubAssessments(opts, new DefaultAzureCredential())

async function getsubAssessments(
  { assessmentName, subscriptionId, resourceGroup, acrName, testDataPath },
  credentials
) {
  const acrRegistry = `https://${acrName}.azurecr.io`
  const secClient = new SecurityCenter(credentials, subscriptionId)

  const subAssessmentsList = await secClient.subAssessments.list(
    `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.ContainerRegistry/registries/${acrName}`,
    assessmentName
  )
  // console.log(subAssessmentsList)
  let subAssessments = []
  for await (sub of subAssessmentsList) {
    subAssessments = [...subAssessments, sub]
  }



const data = {
  syncDate: new Date().toString(),
  subAssessments
}

  writeFileSync(
    `${testDataPath}/getsubAssessments.json`,
    JSON.stringify(data)
  )
  return data
}

module.exports = getsubAssessments
