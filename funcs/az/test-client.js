const {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} = require("@azure/container-registry")
const { DefaultAzureCredential } = require("@azure/identity")



const opts = {
  subscriptionId: process.env.subscriptionId,
  resourceGroup: process.env.resourceGroup,
  acrName: process.env.acrName,
  assessmentName: process.env.assessmentName,
  nsgName: process.env.nsgName,
  acrRegistry: process.env.acrRegistry,
  testDataPath: process.env.testDataPath
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

// const { setLogLevel } = require("@azure/logger");

// setLogLevel("info");

async function main() {
  // endpoint should be in the form of "https://myregistryname.azurecr.io"
  // where "myregistryname" is the actual name of your registry
  const client = new ContainerRegistryClient(
    opts.acrRegistry,
    new DefaultAzureCredential(),
    {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
    }
  )

  console.log("Listing repositories")
  const iterator = client.listRepositoryNames()
  for await (const repository of iterator) {
    console.log(`  repository: ${repository}`)
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err)
})
