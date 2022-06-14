const {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} = require("@azure/container-registry")
const { DefaultAzureCredential } = require("@azure/identity")
const { readFileSync, writeFileSync } = require("fs")
const moment = require("moment")

const opts = {
  acrRegistry: {
    prod: "https://dmzprodeastacr01.azurecr.io",
    nonprod: "https://dmznonproddevacr01.azurecr.io",
  },
  subscriptionId: {
    prod: "cb45d5d6-bd1e-4016-b146-71bfce35fdbe",
    nonprod: "23310d40-a0d5-4446-8433-d0e6b151c2ab",
  },
  appName: "fmds",
  imageRetention: 30,
}

async function main({ acrRegistry, subscriptionId, appName, imageRetention }) {
  // console.log(args)
  // Create a new ContainerRegistryClient
  const client = new ContainerRegistryClient(
    acrRegistry.nonprod,
    new DefaultAzureCredential(),
    {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
    }
  )

  const repo = await client.getRepository(appName)
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

  console.log(
    manifests.filter(
      (i) => i.repositoryName == "fmds" && i.tags.includes("latest")
    )
  )
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
        }
      })

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
  // console.log(filteredTags)
  // .filter((i, index) => index < 3)
  // console.log(filteredTags.length)
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
