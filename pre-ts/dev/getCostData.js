import { CostManagementClient } from "@azure/arm-costmanagement"
import { BillingManagementClient } from "@azure/arm-billing"
import { DefaultAzureCredential } from "@azure/identity"
import { ConsumptionManagementClient } from "@azure/arm-consumption"

// const client = new CostManagementClient(new DefaultAzureCredential(), process.env.ARM_SUBSCRIPTION_ID);
// const client = new BillingManagementClient(new DefaultAzureCredential(), process.env.ARM_SUBSCRIPTION_ID);


const client = new ConsumptionManagementClient(new DefaultAzureCredential(), process.env.ARM_SUBSCRIPTION_ID)

const usage = await client.usageDetails.list("managementGroups/ea508bc7-b43c-4b96-8470-489756e59a14")
// client.usageDetails.list("managementGroups/ea508bc7-b43c-4b96-8470-489756e59a14")
// console.log(await usage)


// for await (let repoName of client.listRepositoryNames()) {
//   repoNames = [...repoNames, repoName]
// }

for await (let usageDetail of usage) {
  console.log(usageDetail)
}
