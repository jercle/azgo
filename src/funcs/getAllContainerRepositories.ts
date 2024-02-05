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

import { cacheExists, getCache, setCache } from './azgoCaching.js'

// import moment = require("momment")

// import * as moment from 'moment'
// import moment = require('moment')
import { formatDistance, formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'


import chalk from "chalk"

import { existsSync, readFileSync, writeFileSync } from "fs"


import { DefaultAzureCredential } from '@azure/identity'

const opts = {
  acrRegistry: process.env.AZGO_ACR_REGISTRY,
  outfile: process.env.AZGO_SAVE_FILE,
  includeManifests: process.env.AZGO_INCLUDE_MANIFESTS,
  // resyncData: true,
  resyncData: process.env.AZGO_RESYNC_DATA,
  subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
}


// getAllContainerRepositories(
//   opts,
//   new DefaultAzureCredential(),
//   cacheDir
// ).then((repositories) => console.log(repositories))


// if (outfile) {
//   writeFileSync(outfile, JSON.stringify(repositories))
// }

export default async function getAllContainerRepositories(
  { acrRegistry, outfile, includeManifests, resyncData, subscriptionId, },
  azCliCredential
) {

  // if (cacheExists('repositories', subscriptionId, cacheDir) && !resyncData) {
  //   console.log(chalk.bold(chalk.green("Loading cached data from file...")))
  //   return getCache('repositories', subscriptionId, cacheDir)
  // }



  const acrUri = `https://${acrRegistry}.azurecr.io`

  // console.log(acrUri)

  const client = new ContainerRegistryClient(acrUri, azCliCredential, {
    audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
  })

  // console.log(client)



  let repoNames = []
  for await (let repoName of client.listRepositoryNames()) {
    repoNames = [...repoNames, repoName]
  }
  let repositories = []


  // console.log(repoNames)
  // process.exit()


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

    // process.exit()

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
    data: repositories,
  }
  if (outfile) {
    writeFileSync(outfile, JSON.stringify(response))
  }
  // console.log(repositories)
  // setCache('repositories', response, subscriptionId, cacheDir)
  return response
  // return JSON.parse(readFileSync('/Users/jercle/git/azgo/testData/20220616/getAllContainerRepositories.json').toString().trim())
}
