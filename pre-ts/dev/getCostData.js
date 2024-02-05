import { CostManagementClient } from "@azure/arm-costmanagement"
import { BillingManagementClient } from "@azure/arm-billing"
import { DefaultAzureCredential } from "@azure/identity"
import { ConsumptionManagementClient } from "@azure/arm-consumption"
import { SubscriptionClient } from "@azure/arm-subscriptions"
import { ResourceManagementClient } from "@azure/arm-resources"

import { writeFileSync } from "fs"

// const client = new CostManagementClient(new DefaultAzureCredential(), process.env.ARM_SUBSCRIPTION_ID);
// const client = new BillingManagementClient(new DefaultAzureCredential(), process.env.ARM_SUBSCRIPTION_ID);

const subscriptionId = ""
const credentials = new DefaultAzureCredential()
const options = { filter: "resourceGroup eq rg-apcdesktop-vnet-aueast" }



async function getResourceGroups(creds, subId) {
  const client = new ResourceManagementClient(creds, subId)
  const resGroupsListResponse = client.resourceGroups.list()
  let resGroups = []

  for await (let resGroup of resGroupsListResponse) {
    resGroups = [resGroup.name, ...resGroups]
  }

  return resGroups
}

async function getSubscriptionDetails(creds, subId) {
  const client = new SubscriptionClient(creds)

  const subscription = await client.subscriptions.get(subId)

  // console.log(subscription)
  return subscription
}
// getSubscriptionDetails(credentials, subscriptionId)

// console.log((await getSubscriptionDetails(credentials, subscriptionId)).displayName)

async function getUsageDetails(creds, subId, billingPeriod) {
  console.log("Getting subscription details")
  // const subscriptionName = (await getSubscriptionDetails(creds, subId)).displayName
  console.log("Getting list of Resource Groups")
  // const resourceGroups = await getResourceGroups(creds, subId)

  console.log("Getting cost data")
  const client = new ConsumptionManagementClient(creds, subId)
  const usageDetailsList = await client.usageDetails.list(
    `/subscriptions/${subId}/providers/Microsoft.Billing/billingPeriods/${billingPeriod}`, { filter: "resourceGroup eq rg-apcdesktop-vnet-aueast" })
  let useageData = []
  for await (let usageDetail of usageDetailsList) {
    console.log(`${usageDetail.resourceGroup} - ${usageDetail.resourceName}`)
    // process.exit(1)
    useageData = [usageDetail, ...useageData]
    break
  }
  console.log(JSON.stringify(useageData))
  // writeFileSync(`${subscriptionName}costData.json`, JSON.stringify(useageData))
}

// getUsageDetails(credentials, subscriptionId, "202401")




// async function getCostingDetails(creds, subId, billingPeriod) {
// const client = new CostManagementClient(credentials)
// const client = new CostManagementClient(credentials, {apiVersion: "2023-07-01"})



// const report = await client.generateDetailedCostReport.beginCreateOperationAndWait(
//   `/subscriptions/${subscriptionId}`,
//   { billingPeriod: "202401" },
// )

// console.log(report)


// }

// const data = await client.generateCostDetailsReport.beginGetOperationResults(`/subscriptions/${subscriptionId}`,"27ea4571-0557-4a3c-bdac-d723636753ab")

// const report = data.toString()

// console.log(report)
