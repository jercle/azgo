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

const opts = {
  subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
  resourceGroup: process.env.AZGO_RESOURCE_GROUP,
  acrRegistry: process.env.acrRAZGO_ACR_REGISTRYegistry,
  saveFile: process.env.AZGO_SAVE_FILE,
  appName: process.env.AZGO_APP_NAME
}
// {
//   subscriptionId,
//   resourceGroup,
//   acrName,
//   assessmentName,
//   nsgName,
//   acrRegistry,
//   testDataPath,
// }


// getContainerRespository(opts).then(res => console.log(res))

async function getContainerRespository(
  { appName, acrRegistry },
  azCliCredential
) {
  const client = new ContainerRegistryClient(
    `https://${acrRegistry}.azurecr.io`,
    new DefaultAzureCredential(),
    {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
    }
  )

  let manifests = []

  // console.log(appName)
  const repo = client.getRepository(appName)
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

  // console.log(repository)
  return repository
}

module.exports = getContainerRespository
