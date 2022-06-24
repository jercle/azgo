import { cli } from 'cli-ux'
import { readFileSync } from 'fs'

import {
  transformVulnerabilityData,
  groupByAttribute,
  getAllUniqueCves,
  countByAttribute
} from './azureVulnarabilityAggregation.js'


const repos = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getAllContainerRepositories.json").toString().trim()).repositories
// console.log(repos)
const assessments = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getsubAssessments.json").toString().trim()).subAssessments
// console.log(assessments)


const result = countByAttribute(transformVulnerabilityData(assessments, repos), "os", "array")


console.log(result)
cli.table(<any>result, {
  attr: {
    header: "Attribute"
  },
  count: {
    // get: row => row.company && row.company.name
  },
}, {
  // printLine: this.log,
  // ...flags, // parsed flags
})
