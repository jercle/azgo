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
const { DefaultAzureCredential } = require("@azure/identity")

// const opts = {
//   acrRegistry: "",
//   subscriptionId: "",
//   repoName: "gm",
//   imageRetention: 30,
// }

// getAllContainerRepositories(opts, new DefaultAzureCredential())

async function getAllContainerRepositories(
  { repoName, acrRegistry },
  azCliCredential
) {
  const client = new ContainerRegistryClient(
    acrRegistry,
    new DefaultAzureCredential(),
    {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
    }
  )

  let repoNames = []
  for await (repoName of client.listRepositoryNames()) {
    repoNames = [...repoNames, repoName]
  }
  let repositories = []

  for (repoName of repoNames) {
    let repoManifests = []
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
    let repoProps = await client.getRepository(repoName).getProperties()
    repositories = [
      ...repositories,
      {
        name: repoProps.name,
        registryLoginServer: repoProps.registryLoginServer,
        createdOn: repoProps.createdOn,
        lastUpdatedOn: repoProps.lastUpdatedOn,
        manifests: repoManifests,
      },
    ]
  }
  // console.log(repositories)
  return repositories
}

module.exports = getAllContainerRepositories
