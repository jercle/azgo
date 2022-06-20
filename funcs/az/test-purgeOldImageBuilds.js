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



purgeOldImageBuilds(opts).then((r) => console.log(r));

async function purgeOldImageBuilds(
  { acrRegistry, subscriptionId, rg },
  azCliCredential
) {
  const client = new ContainerRegistryManagementClient(
    new DefaultAzureCredential(),
    subscriptionId
  );
  // const iterator = await client.registries.get(rg, acrRegistry);
  const iterator = await client.registries.get(rg, acrRegistry)
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
