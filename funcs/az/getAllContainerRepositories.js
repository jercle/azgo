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

const opts = {
  acrRegistry: process.env.acrRegistry,
  testDataPath: process.env.testDataPath,
  saveFile: process.env.saveFile,
  includeManifests: process.env.includeManifests,
}
// {
//   acrRegistry, Example: azurecontainerregistry
//   testDataPath,
// }

// getAllContainerRepositories(
//   opts,
//   new (require("@azure/identity").DefaultAzureCredential)()
// ).then((repositories) => console.log(repositories))

async function getAllContainerRepositories(
  { testDataPath, acrRegistry, saveFile, includeManifests },
  azCliCredential
) {
  if (!acrRegistry) {
    throw Error(bold(red("Missing required environment variable: acrRegistry")))
  }

  const acrUri = `https://${acrRegistry}.azurecr.io`
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
    if (includeManifests) {
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

    if (includeManifests) {
      repository.manifests = repoManifests
    }

    repositories = [...repositories, repository]
  }
  if (saveFile) {
    writeFileSync(
      `${testDataPath}/getAllContainerRepositories.json`,
      JSON.stringify(repositories)
    )
  }
  return repositories
}

module.exports = getAllContainerRepositories
