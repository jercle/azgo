/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} = require("@azure/container-registry")

const moment = require("moment")

const { bold, red } = require("chalk")

const { writeFileSync } = require("fs")

// const opts = {
//   ACR_REGISTRY: process.env.AZGO_ACR_REGISTRY,
//   SAVE_FILE: process.env.AZGO_SAVE_FILE,
//   INCLUDE_MANIFESTS: process.env.AZGO_INCLUDE_MANIFESTS,
// }
// getAllContainerRepositories(
//   opts,
//   new (require("@azure/identity").DefaultAzureCredential)()
// ).then((repositories) => console.log(repositories))

async function getAllContainerRepositories(
  { ACR_REGISTRY, SAVE_FILE, INCLUDE_MANIFESTS },
  azCliCredential
) {
  if (!ACR_REGISTRY) {
    throw Error(
      bold(red("Missing required environment variable: AZGO_ACR_REGISTRY"))
    )
  }

  const acrUri = `https://${ACR_REGISTRY}.azurecr.io`
  const client = new ContainerRegistryClient(acrUri, azCliCredential, {
    audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
  })

  let repoNames = []
  for await (repoName of client.listRepositoryNames()) {
    repoNames = [...repoNames, repoName]
  }
  let repositories = []

  for (repoName of repoNames) {
    let repoManifests = []
    if (INCLUDE_MANIFESTS) {
      for await (manifest of await client
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

    const repository = {
      name: repoProps.name,
      registryLoginServer: repoProps.registryLoginServer,
      createdOn: repoProps.createdOn,
      lastUpdatedOn: repoProps.lastUpdatedOn,
      azgoSyncDate: moment().local().format(),
    }

    if (INCLUDE_MANIFESTS) {
      repository.manifests = repoManifests
    }

    repositories = [...repositories, repository]
  }
  if (SAVE_FILE) {
    writeFileSync(SAVE_FILE, JSON.stringify(repositories))
  }
  return repositories
}

module.exports = getAllContainerRepositories
