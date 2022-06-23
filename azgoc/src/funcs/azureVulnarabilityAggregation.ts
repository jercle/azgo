// import { readFileSync, writeFileSync } from "fs";

// const repos = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getAllContainerRepositories.json").toString().trim()).repositories
// console.log(repos[5])
// const data = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getsubAssessments.json").toString().trim()).subAssessments
// console.log(data)


export function transformVulnerabilityData(data, repos = null) {
  // console.log(repos)
  const taggedManifests = repos ? getAllManifests(repos, 'tagged') : null
  // console.log(taggedManifests)

  return data.map(item => {
    // console.log(taggedManifests[item.additionalData.imageDigest])
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
      imageTags: taggedManifests[item.additionalData.imageDigest] && taggedManifests[item.additionalData.imageDigest].tags || []
    }
  })
}

// transformVulnerabilityData(data, repos).map(i => console.log(i.imageTags))




export function getAllManifests(repos, filter = null) {
  const allTaggedManifests = repos.reduce((all, item, index) => {
    const manifests = item.manifests.map(manifest => {
      // console.log(manifest)
      // console.log({
      //   repo: item.name,
      //   ...manifest
      // })
      return {
        repo: item.name,
        ...manifest
      }
    })
    return all.concat(manifests)
  }, []).filter(item => {
    if (filter === 'tagged') {
      return item.tags.length > 0
    } else if (filter === 'untagged') {
      return item.tags.length === 0
    } else if (filter === null) {
      return true
    }
  })

  // console.log(allTaggedManifests)
  return allTaggedManifests.reduce((all, item, index) => {
    all[item.digest] = {
      repo: item.repo,
      tags: item.tags
    }
    return all
  }, {})
}
// console.log(getAllManifests(repos, 'tagged'))
// getAllManifests(repos, 'tagged')

// export function getAllImageTags



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
// console.log(groupByCve(transformVulnerabilityData(data, repos)))

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
        imageDigest: item.imageDigest,
        imageTags: item.imageTags,
      })
    })
    return all
  }, {})
}



// })
// console.log(transformVulnerabilityData(data, repos))
// console.log(countByAttribute(transformVulnerabilityData(data), "repository", "object"))
// console.log(countByAttribute(getAllCves(transformVulnerabilityData(data)), "title", "object"))
// console.log(Object.keys(countByAttribute(getAllCves(transformVulnerabilityData(data)), "title", "object")).length)



export function groupByAttribute(data, attr: string) {
  if (attr.toLowerCase() === 'imagetags' || attr.toLowerCase() === 'tags') {

    const cvesWithTags = data.filter(item => item.imageTags.length > 0)
    const cvesWithoutTags = data.filter(item => item.imageTags.length === 0)

    let allCves = cvesWithTags.reduce((all, item, index) => {
      let current = item.imageTags.map(tag => {
        if (!all[`${item.repository}:${tag}`]) {
          all[`${item.repository}:${tag}`] = []
        }
        all[`${item.repository}:${tag}`] = [...all[`${item.repository}:${tag}`], item]
      })
      // console.log(current)
      return all
    }, {})
    // console.log(cvesWithoutTags)
    allCves['untagged'] = cvesWithoutTags

    // console.log(allCves.untagged)
    return allCves
  }
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
// console.log(groupByAttribute(transformVulnerabilityData(data, repos), 'tags'))
// groupByAttribute(transformVulnerabilityData(data, repos), 'tags')
// console.log(attribs)
// Object.keys(tags).map(tag => console.log(tags[tag].length))
// transformVulnerabilityData(data, repos)

export function countByAttribute(data, attribute: string, dataType: string) {
  let grouped = groupByAttribute(data, attribute)

  if (dataType === 'object') {
    // returns an object with attr:count
    // Eg: { true: 547, false: 60 }
    const tags = Object.keys(grouped).reduce((all, item, index) => {
      all[item] = grouped[item].length
      return all
    }, {})

    const sorted = Object.fromEntries(
      (Object.entries(tags) as [string, number][]).sort(([, a], [, b]) => a - b)
    );
    // console.log(sorted)
    return sorted
  }

  if (dataType === 'array') {
    // returns an array of obects
    // Eg: [ { attr: 'false', count: 60 }, { attr: 'true', count: 547 } ]
    return Object.keys(grouped).sort().map(i => {
      return {
        attr: i,
        count: grouped[i].length
      }
    }).sort((a, b) => {
      return b.count - a.count
    })
  }
}

// console.log(countByAttribute(transformVulnerabilityData(data, repos), "tags", "object"))
// countByAttribute(transformVulnerabilityData(data, repos), "tags", "object")
// console.log(countByAttribute(transformVulnerabilityData(data, repos), "imageDigest", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data, repos), "osDetails", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data, repos), "severity", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data, repos), "patchable", "object"))
// console.log(countByAttribute(transformVulnerabilityData(data, repos), "category", "object"))





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
