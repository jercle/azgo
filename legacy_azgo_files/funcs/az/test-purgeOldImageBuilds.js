/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { DefaultAzureCredential } = require('@azure/identity');
const {
  ContainerRegistryManagementClient,
} = require('@azure/arm-containerregistry');

const opts = {
  subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
  resourceGroup: process.env.AZGO_RESOURCE_GROUP,
  acrName: process.env.AZGO_ACR_REGISTRY,
  assessmentName: process.env.AZGO_ASSESSMENT_ID,
  nsgName: process.env.nsgName,
  acrRegistry: process.env.AZGO_ACR_REGISTRY,
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



purgeOldImageBuilds(opts)

async function purgeOldImageBuilds(
  { acrRegistry, subscriptionId, resourceGroup },
  azCliCredential
) {
  const client = new ContainerRegistryManagementClient(
    new DefaultAzureCredential(),
    subscriptionId
  );

  console.log({ acrRegistry, subscriptionId, resourceGroup })
  // const iterator = await client.registries.get(rg, acrRegistry);
  const iterator = await client.registries.get(resourceGroup, acrRegistry)
  // client.registries.get()
  // console.log(registries)
  // let registries = [];

  // for await (registry of client.registries.list()) {
  //   registries = [
  //     ...registries,
  //     {
  //       name: registry.displayName,
  //       subscriptionId: registry.subscriptionId,
  //     },
  //   ];
  // console.log(registry)
  // }

  console.log(iterator)

  // for await (const repository of iterator) {
  // console.log(repository);
  // }
  // for await (registry of iterator) {
  //   console.log(registry)
  // }
}

module.exports = purgeOldImageBuilds;
