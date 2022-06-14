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

// const client = new ContainerRegistryClient(
//   "<container registry API endpoint>",
//   new DefaultAzureCredential()
// )

// const opts = {
//   acrRegistry: "",
//   subscriptionId: "",
//   repoName: "gm",
//   imageRetention: 30,
// }

// getContainerRespository(opts)

async function getContainerRespository(
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

  let manifests = []

  const repo = client.getRepository(repoName)
  // console.log(await repo.getProperties())
  for await (manifest of repo.listManifestProperties()) {
    manifests = [...manifests, manifest]
  }

  let repository = await repo.getProperties()
  repository.manifests = manifests

  // let artifact = await repo.getArtifact()
  // client.getArtifact()
  // console.log(repository)
  // console.log(manifests)

  // const repos = await client.listRepositoryNames()
  // // console.log(repos)

  // for await (repo of repos) {
  //   console.log(repo)
  // }

  // let repos = []

  // for await (repo of client.listRepositoryNames()) {
  // repos = [...repos, repo]
  // }

  // console.log(repos)

  // const repository = client.getRepository(repos[0])
  // // console.log(JSON.stringify(repository))
  // // console.log(await repository.getArtifact())
  // const mans = repository.listManifestProperties()
  // for await (man of mans) {
  //   console.log(man)
  // }
  // console.log(mans)

  // console.log()
  return repository
}

module.exports = getContainerRespository
