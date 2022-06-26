// TODO: Filter array from array of conditions.
import { readFileSync, utimes, writeFileSync } from "fs";
import chalk from 'chalk'
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
        return v.toLowerCase().charAt(0).toUpperCase() + v.slice(1).toLowerCase()
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
