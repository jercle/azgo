const {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} = require("@azure/container-registry")
const { DefaultAzureCredential } = require("@azure/identity")

const opts = {
  acrRegistry: "https://dmznonproddevacr01.azurecr.io",
  subscriptionId: "cb45d5d6-bd1e-4016-b146-71bfce35fdbe",
}

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
