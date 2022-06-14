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

purgeOldImageBuilds({
  acrRegistry: 'dmznonproddevacr01',
  subscriptionId: '23310d40-a0d5-4446-8433-d0e6b151c2ab',
  rg: 'DMZ-NonProd-Dev-RG',
}).then((r) => console.log(r));

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
