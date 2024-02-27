import { cli } from 'cli-ux'
import { readFileSync } from 'fs'

import {
  transformVulnerabilityData,
  groupByAttribute,
  getAllUniqueCves,
  countByAttribute
} from './azureVulnarabilityAggregation.js'


const repos = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getAllContainerRepositories.json").toString().trim()).data
// console.log(repos)
const assessments = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getsubAssessments.json").toString().trim()).data
// console.log(assessments)


const result = countByAttribute(transformVulnerabilityData(assessments, repos), "tags", "array")


// cli.open('https://www.google.com.au',)
// await cli.url('sometext', 'https://google.com')

console.log(result)
cli.table(<any>result, {
  attr: {
    header: "Attribute"
  },
  count: {
  },
}, {
  // printLine: myLogger, // custom logger
  // columns: flags.columns,
  // sort: flags.sort,
  // filter: flags.filter,
  // csv: flags.csv,
  // extended: flags.extended,
  // 'no-truncate': flags['no-truncate'],
  // 'no-header': flags['no-header'],
  // ...flags, // parsed flags
})

// const columns: Table.Columns = {
//   // where `.name` is a property of a data object
//   name: {}, // "Name" inferred as the column header
//   id: {
//     header: 'ID', // override column header
//     minWidth: '10', // column must display at this width or greater
//     extended: true, // only display this column when the --extended flag is present
//     get: row => `US-O1-${row.id}`, // custom getter for data row object
//   },
// }

// {
//   columns: Flags.string({exclusive: ['additional'], description: 'only show provided columns (comma-separated)'}),
//   sort: Flags.string({description: 'property to sort by (prepend '-' for descending)'}),
//   filter: Flags.string({description: 'filter property by partial string matching, ex: name=foo'}),
//   csv: Flags.boolean({exclusive: ['no-truncate'], description: 'output is csv format'}),
//   extended: Flags.boolean({char: 'x', description: 'show extra columns'}),
//   'no-truncate': Flags.boolean({exclusive: ['csv'], description: 'do not truncate output to fit screen'}),
//   'no-header': Flags.boolean({exclusive: ['csv'], description: 'hide table header from output'}),
// }
