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
  testDataPath: process.env.testDataPath,
}

getSubAssessments(opts, new DefaultAzureCredential())

async function getSubAssessments(
  { assessmentName, subscriptionId, resourceGroup, acrName, testDataPath },
  credentials
) {
  const acrRegistry = `https://${acrName}.azurecr.io`
  const secClient = new SecurityCenter(credentials, subscriptionId)

  const subAssessmentsList = await secClient.subAssessments.list(
    `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.ContainerRegistry/registries/${acrName}`,
    assessmentName
  )
  console.log(subAssessmentsList)
  let subassessments = []
  for await (subAssessment of subAssessmentsList) {
    subassessments = [...subassessments, subAssessment]
  }

  const dateGathered = new Date().toString()



  writeFileSync(
    `${testDataPath}/subassessments.json`,
    JSON.stringify(subassessments)
  )
  return subassessments
}

module.exports = getSubAssessments
