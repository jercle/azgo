import { existsSync, readFileSync, writeFileSync } from "fs"

import getAllContainerRepositories from "./getAllContainerRepositories.js";
import getSubAssessments from "./getSubAssessments.js";

import { DefaultAzureCredential } from "@azure/identity";

const opts = {
  subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
  resourceGroup: process.env.AZGO_RESOURCE_GROUP,
  assessmentId: process.env.AZGO_ASSESSMENT_ID,
  acrRegistry: process.env.AZGO_ACR_REGISTRY,
  saveFile: process.env.AZGO_SAVE_FILE,
  includeManifests: false,
  resyncData: true
}

aggregateReposAndAssessments(
  opts,
  new DefaultAzureCredential()
)

export default async function aggregateReposAndAssessments(opts,
  credentials
) {

  // console.log('getting repos')
  const repos = await getAllContainerRepositories(opts, credentials);
  console.log(`${repos.repositories.length} repos`)
  // console.log(repos)
  // console.log('getting assessments')
  const assessments = await getSubAssessments(opts, credentials)
  console.log(`${assessments.subAssessments.length} vulnerability alerts`)
  // console.log('done')

  // const aggregatedData =


  // writeFileSync(opts.saveFile, JSON.stringify(assessments))
}
