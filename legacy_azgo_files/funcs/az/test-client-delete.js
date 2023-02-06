const {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} = require("@azure/container-registry")
const { DefaultAzureCredential } = require("@azure/identity")
const { readFileSync, writeFileSync } = require("fs")
const moment = require("moment")
const {
  formatDistance,
  formatISO,
  differenceInHours,
  differenceInDays,
  parseISO,
  parseJSON,
} = require("date-fns")

const opts = {
  subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
  resourceGroup: process.env.AZGO_RESOURCE_GROUP,
  acrName: process.env.AZGO_ACR_REGISTRY,
  assessmentName: process.env.AZGO_ASSESSMENT_ID,
  nsgName: process.env.nsgName,
  acrRegistry: process.env.AZGO_ACR_REGISTRY,
  testDataPath: process.env.testDataPath,
  imageRetention: 30
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

async function main({ acrRegistry, subscriptionId, appName, imageRetention }) {
  // console.log(args)
  // Create a new ContainerRegistryClient
  const client = new ContainerRegistryClient(
    `https://${acrRegistry}.azurecr.io`,
    new DefaultAzureCredential(),
    {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
    }
  )

  const repo = await client.getRepository("gm")
  const iterator = await repo.listManifestProperties()
  // const image = client.getArtifact("library/hello-world", "v1");
  // const artifact = repo.getArtifact('latest');
  // const artifact = repo.getArtifact('latest');
  // console.log(artifact);

  let manifests = []
  for await (const manifest of iterator) {
    manifests = [...manifests, manifest]
  }

  // writeFileSync('../testData/gm-manifests.json', JSON.stringify(manifests));
  // const manifests = JSON.parse(readFileSync("../testData/gm-manifests.json"))

  // console.log(
  //   manifests.filter(
  //     (i) => i.repositoryName == "gm" && i.tags.includes("latest")
  //   )
  // )
  // console.log(manifests)
  // Reduce result to single array of tags
  const repoTags = manifests
    .reduce((all, item, index) => {
      let objects = item.tags.map((i) => {
        return {
          tag: i,
          digest: item.digest,
          createdOn: new Date(item.createdOn),
          createdOnFormatted: new Date().toString(),
          lastUpdatedOn: new Date(item.lastUpdatedOn),
          tagAge: moment().diff(item.lastUpdatedOn, "days"),
          // tagAge: differenceInDays(new Date(), parseJSON(item.lastUpdatedOn)),
        }
      })

      // const hoursSinceSync = differenceInHours(new Date(), parseISO(cache.azgoSyncDate))

      return [...all, ...objects]
    }, [])
    .sort((a, b) => a.createdOn - b.createdOn)
    .reverse()
  // console.log(repoTags)

  const filteredTags = repoTags.filter(
    (item) =>
      (item.tag.includes("latest") && item.tag !== "latest") ||
      (item.tagAge > imageRetention && item.tag !== "latest")
  )
  console.log(filteredTags)
  // .filter((i, index) => index < 3)
  console.log(filteredTags.length)
  // console.log()

  // const tagData = repoTags.map((tag) => {
  //   return {
  //     name: tag,
  //   };
  //   // return tag;
  // });
  // console.log(tagData);

  // repoTags.map((tag) => console.log(tag));

  // Iterate through repositories
  // const repositoryNames = client.listRepositoryNames();

  // for await (const repositoryName of repositoryNames) {
  //   const repository = client.getRepository(repositoryName);
  //   // Obtain the images ordered from newest to oldest by passing the `orderBy` option
  //   const imageManifests = repository.listManifestProperties({
  //     orderBy: 'LastUpdatedOnDescending',
  //   });
  //   const imagesToKeep = 3;
  //   let imageCount = 0;
  //   // Delete images older than the first three.
  //   for await (const manifest of imageManifests) {
  //     imageCount++;
  //     if (imageCount > imagesToKeep) {
  //       const image = repository.getArtifact(manifest.digest);
  //       console.log(`Deleting image with digest ${manifest.digest}`);
  //       console.log(`  Deleting the following tags from the image:`);
  //       for (const tagName of manifest.tags) {
  //         console.log(`    ${manifest.repositoryName}:${tagName}`);
  //         // // image.deleteTag(tagName);
  //       }
  //       // // await image.delete();
  //     }
  //   }
  // }
}

main(opts).catch((err) => {
  console.error("The sample encountered an error:", err)
})
