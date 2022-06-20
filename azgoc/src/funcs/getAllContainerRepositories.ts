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

import * as moment from "moment"
import { bold, red } from "chalk"
import { writeFileSync } from "fs"

// const opts = {
//   acrRegistry: process.env.AZGO_ACR_REGISTRY,
//   saveFile: process.env.AZGO_SAVE_FILE,
//   includeManifests: process.env.AZGO_INCLUDE_MANIFESTS,
// }
// getAllContainerRepositories(
//   opts,
//   new (require("@azure/identity").DefaultAzureCredential)()
// ).then((repositories) => console.log(repositories))

export default async function getAllContainerRepositories(
  { acrRegistry, saveFile, includeManifests },
  azCliCredential
) {
  if (!acrRegistry) {
    throw Error(
      bold(red("Missing required environment variable: AZGO_acrRegistry"))
    )
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
      azgoSyncDate: string,
      manifests?: any
    } = {
      name: repoProps.name,
      registryLoginServer: repoProps.registryLoginServer,
      createdOn: repoProps.createdOn,
      lastUpdatedOn: repoProps.lastUpdatedOn,
      azgoSyncDate: moment().local().format(),
    }

    if (includeManifests) {
      repository.manifests = repoManifests
    }

    repositories = [...repositories, repository]
  }
  if (saveFile) {
    writeFileSync(saveFile, JSON.stringify(repositories))
  }
  return repositories
}
