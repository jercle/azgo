/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

//  const { DefaultAzureCredential } = require("@azure/identity")
//  const { SecurityCenter } = require("@azure/arm-security")
const { readFileSync } = require("fs")

const opts = {
  subscriptionId: process.env.subscriptionId,
  resourceGroup: process.env.resourceGroup,
  acrName: process.env.acrName,
  assessmentName: process.env.assessmentName,
  testDataPath: process.env.testDataPath
}

updateAssessmentsDatabase(opts)
// updateAssessmentsDatabase(opts, new DefaultAzureCredential())

async function updateAssessmentsDatabase(
  { assessmentName, subscriptionId, resourceGroup, acrName, testDataPath}
) {
const subs = require(`${testDataPath}/subassessments.json`)


const data = {
  dateGathered: new Date().toString(),
  subassessments: subs
}
console.log(data)


  return
}

module.exports = updateAssessmentsDatabase
