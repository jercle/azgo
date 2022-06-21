/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

import {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} from "@azure/container-registry"

// import moment = require("momment")

// import * as moment from 'moment'
import moment = require('moment')
import { formatDistance, formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'


import chalk from "chalk"

import { existsSync, readFileSync, writeFileSync } from "fs"


// import { DefaultAzureCredential } from '@azure/identity'

// const opts = {
//   acrRegistry: process.env.AZGO_ACR_REGISTRY,
//   saveFile: process.env.AZGO_SAVE_FILE,
//   includeManifests: process.env.AZGO_INCLUDE_MANIFESTS,
// }
// getAllContainerRepositories(
//   opts,
//   new (require("@azure/identity").DefaultAzureCredential)()
// ).then((repositories) => console.log(repositories))


// if (saveFile) {
//   writeFileSync(saveFile, JSON.stringify(repositories))
// }

export default async function getAllContainerRepositories(
  { acrRegistry, saveFile, includeManifests, resyncData },
  azCliCredential
) {

  if (existsSync(saveFile) && !resyncData) {
    console.log(chalk.bold(chalk.green("Loading cached data from file...")))
    const data = JSON.parse(readFileSync(saveFile).toString())
    // console.log(`Last synced ${differenceInHours(new Date(), parseISO(data.azgoSyncDate))} hours ago`)
    console.log(`Last synced ${formatDistance(parseISO(data.azgoSyncDate), new Date(), { addSuffix: true })}`)
    // console.log(data)
    return data
  }

  const acrUri = `https://${acrRegistry}.azurecr.io`
  const client = new ContainerRegistryClient(acrUri, azCliCredential, {
    audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
  })

  let repoNames = []
  for await (let repoName of client.listRepositoryNames()) {
    repoNames = [...repoNames, repoName]
  }
  let repositories = []

  for (let repoName of repoNames) {
    let repoManifests = []
    if (includeManifests) {
      for await (let manifest of await client
        .getRepository(repoName)
        .listManifestProperties()) {
        repoManifests = [
          ...repoManifests,
          {
            digest: manifest.digest,
            tags: manifest.tags,
          },
        ]
      }
    }

    let repoProps = await client.getRepository(repoName).getProperties()

    let repository: {
      name: string,
      registryLoginServer: string,
      createdOn: Date,
      lastUpdatedOn: Date,
      manifests?: any
    } = {
      name: repoProps.name,
      registryLoginServer: repoProps.registryLoginServer,
      createdOn: repoProps.createdOn,
      lastUpdatedOn: repoProps.lastUpdatedOn
    }

    if (includeManifests) {
      repository.manifests = repoManifests
    }

    repositories = [...repositories, repository]

  }
  const response = {
    azgoSyncDate: formatISO(new Date()),
    repositories,
  }
  if (saveFile) {
    writeFileSync(saveFile, JSON.stringify(response))
  }
  // console.log(repositories)
  return response
}
