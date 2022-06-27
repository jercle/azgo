// TODO: Filter array from array of conditions.
import { readFileSync, utimes, writeFileSync } from "fs";

import chalk from 'chalk'
import { MongoClient } from "mongodb";


import {
  transformVulnerabilityData,
  groupByAttribute,
  getAllUniqueCves,
  countByAttribute
} from './azureVulnarabilityAggregation.js'


// const repos = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getAllContainerRepositories.json").toString().trim()).repositories
// console.log(repos[5])
// const data = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getsubAssessments.json").toString().trim()).subAssessments
// console.log(data)


// vulnerabilityFilter(transformVulnerabilityData(data, repos), ["os:windows", "patchable:false", "severity:medium"])

export function vulnerabilityFilter(data, filter) {
  const filters = filter.reduce((all, item, index) => {
    let [attr, val] = item.split(':')
    if (!all[attr]) {
      all[attr] = []
    }
    all[attr] = val.split(',').map(v => {
      if (v.toLowerCase() === 'true') {
        return true
      } else if (v.toLowerCase() === 'false') {
        return false
      } else {
        return v.toLowerCase()
      }
    })
    return all
  }, {})

  const filterKeys = Object.keys(filters);
  const filtered = data.filter(function (eachObj) {
    return filterKeys.every(function (eachKey) {
      if (!filters[eachKey].length) {
        return true;
      }
      return filters[eachKey].includes(eachObj[eachKey]);
    });
  });
  // console.log(filtered)
  return filtered
}


export async function uploadToMongoDatabase(data, { dbConnectionString }) {
  const client = new MongoClient(dbConnectionString);
  try {
    console.log(`Uploading ${chalk.yellow(data.length)} vulnerabilities to database`)

    await client.connect();
    const database = client.db("client-dawe-azgo-db")
    const vulns = database.collection("client-dawe-azgo-vulnerabilities")

    let bulk = vulns.initializeUnorderedBulkOp()
    data.forEach(async (vuln) => {

      await bulk.find({ _id: vuln._id }).upsert().replaceOne(vuln)
    })
    const bulkExecution = await bulk.execute()
    console.log(bulkExecution)

  } catch (err) {
    console.log(err)

  } finally {

    await client.close();
  }
}
