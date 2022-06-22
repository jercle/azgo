import { readFileSync, writeFileSync } from "fs";

// const repos = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getAllContainerRepositories.json").toString().trim()).repositories
// console.log(repos[5])
// const data = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/aggregateReposAndAssessments-windowsVulns.json").toString().trim())
// const data = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getsubAssessments.json").toString().trim()).subAssessments
// console.log(data)

export function transformVulnerabilityData(data, repos = null) {
  const taggedManifests = repos ? getAllManifests(repos) : null
  return data.map(item => {
    return {
      _id: item.name,
      repository: item.additionalData.repositoryName,
      displayName: item.displayName,
      remediation: item.remediation,
      impact: item.impact,
      category: item.category,
      cves: item.additionalData.cve || [],
      vendorReferences: item.additionalData.vendorReferences || [],
      description: item.description,
      resourceId: item.id,
      severity: item.status.severity,
      patchable: item.additionalData.patchable,
      os: item.additionalData.imageDetails && item.additionalData.imageDetails.os || null,
      osDetails: item.additionalData.imageDetails && item.additionalData.imageDetails.osDetails || null,
      imageDigest: item.additionalData.imageDigest,
      imageTags: taggedManifests[item.imageDigest] || []
    }
  })
}

export function getAllManifests(repos, filter = null) {
  const allTaggedManifests = repos.reduce((all, item, index) => {
    return all.concat(item.manifests)
  }, []).filter(item => {
    if (filter === 'tagged') {
      return item.tags.length > 0
    } else if (filter === 'untagged') {
      return item.tags.length === 0
    } else if (filter === null) {
      return true
    }
  })

  return allTaggedManifests.reduce((all, item, index) => {
    all[item.digest] = item.tags
    return all
  }, {})
}



// create flat array of all cves across all assessments
export function getAllUniqueCves(data) {
  return [...new Set(data.reduce((acc, item) => {
    return acc.concat(item.cves)
  }, []).map(cve => cve.title))]
}

export function groupByCve(data) {
  return data.reduce((acc, item) => {
    const cves = item.cves.map(cve => cve.title)
    cves.forEach(cve => {
      if (!acc[cve]) {
        acc[cve] = []
      }
      acc[cve].push(item)
    })
    return acc
  }, {})
}
// console.log(groupByCve(transformVulnerabilityData(data)))

export function groupByRepoUnderCve(data) {
  return data.reduce((all, item, index) => {
    const cves = item.cves.map(cve => cve.title)
    cves.forEach(cve => {
      if (!all[cve]) {
        all[cve] = {}
      }
      if (!all[cve][item.repository]) {
        all[cve][item.repository] = []
      }
      all[cve][item.repository].push({
        imageDigest: item.imageDigest
      })
    })
    return all
  }, {})
}


// })
// console.log(transformVulnerabilityData(data))
// console.log(countByAttribute(transformVulnerabilityData(data), "repository", "object"))
// console.log(countByAttribute(getAllCves(transformVulnerabilityData(data)), "title", "object"))
// console.log(Object.keys(countByAttribute(getAllCves(transformVulnerabilityData(data)), "title", "object")).length)



export function groupByAttribute(data, attr: string) {
  return data.reduce((all, item, index) => {
    if (!all[item[attr]]) {
      all[item[attr]] = [];
    }
    all[item[attr]] = [
      ...all[item[attr]],
      item,
    ];
    return all;
  }, {});
}
// console.log(Object.keys(groupByAttribute(transformVulnerabilityData(data), 'patchable')))
// console.log(groupByAttribute(transformVulnerabilityData(data), 'imageDigest'))



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
// console.log(countByAttribute(transformVulnerabilityData(data), "imageDigest", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data), "osDetails", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data), "severity", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data), "patchable", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data), "category", "object"))





export interface VulnerabilityDataObject {
  id: string;
  name: string;
  type: string;
  idPropertiesId?: string | null;
  displayName?: string | null;
  status: Status;
  remediation?: string | null;
  impact?: string | null;
  category?: string | null;
  description?: string | null;
  timeGenerated: string;
  resourceDetails: ResourceDetails;
  additionalData: AdditionalData;
}
export interface Status {
  code: string;
  severity: string;
}
export interface ResourceDetails {
  source: string;
  id: string;
}
export interface AdditionalData {
  assessedResourceType: string;
  type?: string | null;
  cvss?: any;
  patchable: boolean;
  cve?: (CveEntityOrVendorReferencesEntity | null)[] | null;
  publishedTime: string;
  vendorReferences?: (CveEntityOrVendorReferencesEntity | null)[] | null;
  repositoryName: string;
  imageDigest: string;
  registryHost: string;
  cicdData: CicdData;
  imageDetails?: ImageDetails | null;
  metadata?: Metadata | null;
}
export interface CveEntityOrVendorReferencesEntity {
  title: string;
  link: string;
}
export interface CicdData {
  status: string;
}
export interface ImageDetails {
  os: string;
  osDetails: string;
}
export interface Metadata {
  isPreview: boolean;
}

export interface RespositoryObject {
  name: string;
  registryLoginServer: string;
  createdOn: string;
  lastUpdatedOn: string;
  manifests?: (ManifestsEntity)[] | null;
}
export interface ManifestsEntity {
  digest: string;
  tags?: (string | null)[] | null;
}
