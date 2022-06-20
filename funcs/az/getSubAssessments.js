/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { SecurityCenter } = require("@azure/arm-security")
const { writeFileSync } = require("fs")
const moment = require("moment")

const opts = {
  subscriptionId: process.env.subscriptionId,
  resourceGroup: process.env.resourceGroup,
  assessmentId: process.env.assessmentId,
  acrRegistry: process.env.acrRegistry,
  testDataPath: process.env.testDataPath,
  saveFile: process.env.saveFile,
}

// {
//   subscriptionId,
//   resourceGroup,
//   assessmentId,
//   acrRegistry,
//   testDataPath,
// }

getsubAssessments(
  opts,
  new (require("@azure/identity").DefaultAzureCredential)()
).then((res) => console.log(res))

async function getsubAssessments(
  {
    assessmentId,
    subscriptionId,
    resourceGroup,
    acrRegistry,
    testDataPath,
    saveFile,
  },
  credentials
) {
  const client = new SecurityCenter(credentials, subscriptionId)

  const subAssessmentsList = await client.subAssessments.list(
    `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.ContainerRegistry/registries/${acrRegistry}`,
    assessmentId
  )

  let subAssessments = []
  for await (sub of subAssessmentsList) {
    subAssessments = [...subAssessments, sub]
  }

  const data = {
    azgoSyncDate: moment().local().format(),
    subAssessments,
  }

  if (saveFile) {
    writeFileSync(
      `${testDataPath}/getsubAssessments.json`,
      JSON.stringify(data)
    )
  }

  return data
}

module.exports = getsubAssessments
