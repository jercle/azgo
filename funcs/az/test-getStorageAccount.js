/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { StorageManagementClient } = require("@azure/arm-storage")
const { DefaultAzureCredential } = require("@azure/identity")

const {
  BlobServiceClient,
} = require("@azure/storage-blob")

const opts = {
  acrRegistry: "",
  subscriptionId: {
    prod: "",
    nonprod: "",
  },
  appName: "static",
  storageAccount: "",
  appEnv: "dev",
}

getBlobStorage(opts, new DefaultAzureCredential())

async function getBlobStorage(
  { appEnv, appName, subscriptionId, storageAccount },
  credential
) {
  const env = () => {
    switch (appEnv) {
      case "dev":
        return "nonprod-dev"
        break
      case "test":
        return "nonprod-test"
        break
      case "prod":
        return "prod"
        break
    }
  }
  const resourceGroup = `DMZ-${env()}-${appName}-RG`
  // //   const client = new BlobServiceClient(, credential)
  const storageManagementClient = new StorageManagementClient(
    credential,
    subscriptionId.nonprod
  )
  const blobServiceUrl = `https://${storageAccount}.blob.core.windows.net`

  const blobServiceClient = new BlobServiceClient(blobServiceUrl, credential)

  // const account = await blobServiceClient.getAccountInfo()
  // const account = await
  let blobs = []
  // for await (blob of blobServiceClient
  //   .getContainerClient('$web')
  //   .listBlobsFlat()) {
  //   blobs = [...blobs, blob]
  // }
  let blob = await blobServiceClient.getProperties()
  console.log(blob)

  // let storageAccounts = []
  //   for await (account of storageManagementClient.storageAccounts.listByResourceGroup(resourceGroup)) {
  //     storageAccounts = [...storageAccounts, account]
  //   }
  // console.log(JSON.stringify(storageAccounts)
  // )

  // let account = await storageManagementClient.storageAccounts.getProperties(resourceGroup, storageAccount)
  // console.log(JSON.stringify(account))
}

module.exports = getBlobStorage
