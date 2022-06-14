/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

// const { DefaultAzureCredential } = require("@azure/identity")
const { SecurityCenter } = require("@azure/arm-security")

const opts = {
  acrRegistry: "",
  subscriptionId: "",
  imageName: "",
  imageRetention: 30,
  resourceGroup: "",
  acrName: "",
}

// getSubAssessments(opts, new DefaultAzureCredential())

async function getSubAssessments(
  { assessmentName, subscriptionId, resourceGroup, acrName },
  credentials
) {
  const acrRegistry = `https://${acrName}.azurecr.io`
  const secClient = new SecurityCenter(credentials, subscriptionId)

  const subAssessmentsList = secClient.subAssessments.list(
    `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.ContainerRegistry/registries/${acrName}`,
    assessmentName
  )
  let subassessments = []
  for await (subAssessment of subAssessmentsList) {
    subassessments = [...subassessments, subAssessment]
  }
  return subassessments
}

module.exports = getSubAssessments
