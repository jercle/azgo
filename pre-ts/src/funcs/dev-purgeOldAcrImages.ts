// TODO: Get list of subscriptions from user - default to default subscription
// TODO: Get list of all ACRs from provided subscriptions - option for single ACR
// TODO: Get list of all images in each ACR
// TODO: Get list of all App Services and the images they're using
// TODO: Ignore 'latest' tag and most recent build, as well as all images in use.


const opts = {
  acrRegistry: process.env.AZGO_ACR_REGISTRY,
  // outfile: process.env.AZGO_SAVE_FILE,
  // resyncData: true,
  // resyncData: process.env.AZGO_RESYNC_DATA,
  subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
}


export default async function purgeOldAcrImages(
  { subscriptionId },
  azCliCredential
) {

}
