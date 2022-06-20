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

// const opts = {
//   SUBSCRIPTION_ID: process.env.AZGO_SUBSCRIPTION_ID,
//   RESOURCE_GROUP: process.env.AZGO_RESOURCE_GROUP,
//   ASSESSMENT_ID: process.env.AZGO_ASSESSMENT_ID,
//   ACR_REGISTRY: process.env.AZGO_ACR_REGISTRY,
//   SAVE_FILE: process.env.AZGO_SAVE_FILE,
// }
// getsubAssessments(
//   opts,
//   new (require("@azure/identity").DefaultAzureCredential)()
// ).then((res) => console.log(res))

async function getsubAssessments(
  { ASSESSMENT_ID, SUBSCRIPTION_ID, RESOURCE_GROUP, ACR_REGISTRY, SAVE_FILE },
  credentials
) {
  const client = new SecurityCenter(credentials, SUBSCRIPTION_ID)

  const subAssessmentsList = await client.subAssessments.list(
    `/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ContainerRegistry/registries/${ACR_REGISTRY}`,
    ASSESSMENT_ID
  )

  let subAssessments = []
  for await (sub of subAssessmentsList) {
    subAssessments = [...subAssessments, sub]
  }

  const data = {
    azgoSyncDate: moment().local().format(),
    subAssessments,
  }

  if (SAVE_FILE) {
    writeFileSync(SAVE_FILE, JSON.stringify(data))
  }

  return data
}

module.exports = getsubAssessments
