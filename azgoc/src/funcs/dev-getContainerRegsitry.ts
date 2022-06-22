import { ContainerRegistryManagementClient } from '@azure/arm-containerregistry'
import { DefaultAzureCredential } from '@azure/identity'
import { readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'

const activeSubscription = JSON.parse(readFileSync(`${homedir()}/.azure/azureProfile.json`)
  .toString()
  .trim())
  .subscriptions
  .filter(sub => sub.isDefault)[0]

const client = new ContainerRegistryManagementClient(new DefaultAzureCredential(), activeSubscription.id);

// const regFetch = await client.registries.list

// console.log(registries)

// let registries = []

// for await (const regsistry of regFetch) {
//   registries = [...registries, regsistry]
// }

// console.log(registries)

// console.log(await client.registries.get("DMZ-NonProd-Dev-RG", "DMZNonProdDevACR01"))

// writeFileSync('/Users/jercle/git/azgo/testData/20220622/getContainerRegistry-Prod.json', JSON.stringify(registries, null, 2))
