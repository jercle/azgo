// export default function countVulnerabilities(data) {

// }

// import { readFileSync } from "fs";

// const data = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/aggregateReposAndAssessments-windowsVulns.json").toString().trim())
// const data = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getsubAssessments.json").toString().trim()).subAssessments
// console.log(data)

export function groupByAttribute(data, attribute: string) {
  return data.reduce((all, item, index) => {

    let attr = ""
    switch (attribute) {
      case "repo":
        attr = item.additionalData.repositoryName
        break;
      case "sev":
        attr = item.status.severity
        break;
      case "patchable":
        attr = item.additionalData.patchable
        break;
      case "category":
        attr = item.category
      default:
        break;
    }

    if (!all[attr]) {
      all[attr] = [];
    }
    all[attr] = [
      ...all[attr],
      {
        _id: item.name,
        repository: item.additionalData.repositoryName,
        displayName: item.displayName,
        remediation: item.remediation,
        impact: item.impact,
        description: item.description,
        resourceId: item.id,
        severity: item.status.severity,
        patchable: item.additionalData.patchable,
        imageDigest: item.additionalData.imageDigest,
        os: item.additionalData.imageDetails && item.additionalData.imageDetails.os || null,
        osDetails: item.additionalData.imageDetails && item.additionalData.imageDetails.osDetails || null,
      },
    ];
    return all;
  }, {});
}
// console.log(Object.keys(groupByAttribute(data, 'patchable')))
// console.log(groupByAttribute(data, 'patchable'))



export function countByAttribute(data, attribute: string, dataType: string) {
  let grouped = groupByAttribute(data, attribute)

  if (dataType === 'object') {
    // returns an object with attr:count
    // Eg: { true: 547, false: 60 }
    return Object.keys(grouped).reduce((all, item, index) => {
      all[item] = grouped[item].length
      return all
    }, {})
  }

  if (dataType === 'array') {
    // returns an array of obects
    // Eg: [ { attr: 'false', count: 60 }, { attr: 'true', count: 547 } ]
    return Object.keys(grouped).sort().map(i => {
      return {
        attr: i,
        count: grouped[i].length
      }
    })
  }
}
console.log(countByAttribute(data, "sev", "object"))
// countByRepository(data)
// console.log(countByRepository(data))
// return Object.keys(grouped).sort().map(i => console.log(grouped[i].length, i))









// export function groupByRepository(data) {
//   return data.reduce((all, item, index) => {
//     if (!all[item.additionalData.repositoryName]) {
//       all[item.additionalData.repositoryName] = [];
//     }
//     all[item.additionalData.repositoryName] = [
//       ...all[item.additionalData.repositoryName],
//       {
//         _id: item.name,
//         displayName: item.displayName,
//         remediation: item.remediation,
//         impact: item.impact,
//         description: item.description,
//         resourceId: item.id,
//         severity: item.status.severity,
//         patchable: item.additionalData.patchable,
//         imageDigest: item.additionalData.imageDigest,
//         os: item.additionalData.imageDetails && item.additionalData.imageDetails.os || null,
//         osDetails: item.additionalData.imageDetails && item.additionalData.imageDetails.osDetails || null,
//       },
//     ];
//     return all;
//   }, {});
// }
// console.log(groupByRepository(data))
