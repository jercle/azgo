const { writeFileSync, readFileSync, writeFile } = require('fs')

// const appsUsed = readFileSync('../testData/dt1-user_machine_displayname_usage_dawr_2022.csv').toString().split('\r\n')
const appsUsed = readFileSync('../testData/dt1-user_machine_subset.csv').toString().split('\n')
const appsUsedKeys = appsUsed[0].split(',')
const allUsage = appsUsed.slice(1)


// const aggregatedData = allUsage.map(item => {
//   let data = item.split('\\\\').join().split(',')
//   const obj = {
//     domain: data[0],
//     username: data[1],
//     machineId: data[2],
//     application: data[3],
//     totalTimeSecons: data[4],
//     timeActive: data[5]
//   }
//   return obj
// })


/////////// List unique applications
const uniqueApplications = [...new Set(allUsage.map(item => item.split(',')[2]))].sort()
// writeFileSync('./dt1-uniqueApplications.csv', uniqueApplications.join('\n'))
console.log(uniqueApplications.join('\n'))
///////////





// const users = readFileSync('../testData/dt1-users.csv')


// console.log(appsUsed)
// console.log(allApps)
// console.log(aggregatedData)
// console.log(appsUsedKeys)
