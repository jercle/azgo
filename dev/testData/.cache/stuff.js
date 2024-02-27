// test-GetAssessments.js
// test-GetAssessments.js
// test-GetAssessments.js
console.log(
  subs.filter(
    (sub) =>
      sub.id ==
      "/subscriptions/23310d40-a0d5-4446-8433-d0e6b151c2ab/resourceGroups/DMZ-NonProd-Dev-RG/providers/Microsoft.ContainerRegistry/registries/DMZNonProdDevACR01/providers/Microsoft.Security/assessments/dbd0cb49-b563-45e7-9724-889e799fa648/subassessments/8aa92239-456a-9da0-2442-21266cb24f89"
  )
)
writeFileSync(
  "../testData/singeSubAssessment.json",
  JSON.stringify(
    subs.filter(
      (sub) =>
        sub.id ==
        "/subscriptions/23310d40-a0d5-4446-8433-d0e6b151c2ab/resourceGroups/DMZ-NonProd-Dev-RG/providers/Microsoft.ContainerRegistry/registries/DMZNonProdDevACR01/providers/Microsoft.Security/assessments/dbd0cb49-b563-45e7-9724-889e799fa648/subassessments/8aa92239-456a-9da0-2442-21266cb24f89"
    )
  )
)
const subAss = await client.subAssessments.get(
  "/subscriptions/23310d40-a0d5-4446-8433-d0e6b151c2ab/resourceGroups/DMZ-NonProd-Dev-RG/providers/Microsoft.ContainerRegistry/registries/DMZNonProdDevACR01/",
  "dbd0cb49-b563-45e7-9724-889e799fa648",
  "d3c2dfc7-d54d-8aaf-f48a-de364522ea3a"
)
// console.log(subAss)
let is = []
for await (i of client.subAssessments.listAll(
  "/subscriptions/23310d40-a0d5-4446-8433-d0e6b151c2ab"
)) {
  is = [...is, i]
}
const assessments = JSON.parse(readFileSync("../testData/assessments.json"))
const keyVaultUrl = `https://dmz-${env()}-${appName}-kv.vault.azure.net/`;




// test-getAllContainerRepositories.js
// test-getAllContainerRepositories.js
// test-getAllContainerRepositories.js
// test-getAllContainerRepositories.js
