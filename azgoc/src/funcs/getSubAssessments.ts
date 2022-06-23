/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

import { existsSync, readFileSync, writeFileSync } from "fs"

import { SecurityCenter } from "@azure/arm-security"
import { formatDistance, formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'
import chalk from "chalk"

// const opts = {
//   subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
//   resourceGroup: process.env.AZGO_RESOURCE_GROUP,
//   assessmentId: process.env.AZGO_ASSESSMENT_ID,
//   acrRegistry: process.env.AZGO_ACR_REGISTRY,
//   outfile: process.env.AZGO_SAVE_FILE,
//   resyncData: false
// }

import { DefaultAzureCredential } from '@azure/identity'

// getsubAssessments(
//   opts,
//   new DefaultAzureCredential()
// )
// ).then((res) => console.log(res))

export default async function getsubAssessments(
  { assessmentId, subscriptionId, resourceGroup, acrRegistry, outfile, resyncData},
  credentials
) {

  // if (existsSync(outfile) && !resyncData) {
  //   console.log(chalk.bold(chalk.green("Loading cached data from file...")))
  //   const data = JSON.parse(readFileSync(outfile).toString())
  //   // console.log(`Last synced ${differenceInHours(new Date(), parseISO(data.azgoSyncDate))} hours ago`)
  //   console.log(`Last synced ${formatDistance(parseISO(data.azgoSyncDate), new Date(), { addSuffix: true })}`)
  //   // console.log(data)
  //   return data
  // }


  // const client = new SecurityCenter(credentials, subscriptionId)

  // const subAssessmentsList = await client.subAssessments.list(
  //   `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.ContainerRegistry/registries/${acrRegistry}`,
  //   assessmentId
  // )

  // let subAssessments = []
  // for await (sub of subAssessmentsList) {
  //   subAssessments = [...subAssessments, sub]
  // }

  // const data = {
  //   azgoSyncDate: formatISO(new Date()),
  //   subAssessments,
  // }

  // if (outfile) {
  //   writeFileSync(outfile, JSON.stringify(data))
  // }

  // const cacheData = JSON.parse(readFileSync('/Users/jercle/git/azgo/testData/20220616/getSubAssessments.json').toString().trim())

  return JSON.parse(readFileSync('/Users/jercle/git/azgo/testData/20220616/getSubAssessments.json').toString().trim())
  // return data
}
