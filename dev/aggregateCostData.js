import { readFileSync, writeFileSync } from "fs"
import * as XLSX from 'xlsx/xlsx.mjs'

import cliProgress from "cli-progress"

/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);

function formatValue(v, options, type) {
  function autopadding(value, length) {
    return (options.autopaddingChar + value).slice(-length)
  }
  switch (type) {
    case 'percentage':
      return autopadding(v, 3)
    case 'total':
      return (v + 1).toLocaleString('en-US')
    case 'value':
      return (v + 1).toLocaleString('en-US')
    default:
      return v
  }
}

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    stopOnComplete: true,
    hideCursor: true,
    format: ' {bar} | {percentage}% {value}/{total} | {filename} | Duration: {duration_formatted}',
    formatValue
  },
  cliProgress.Presets.shades_grey
)

function csvToArray(str, delimiter = '\t', filename) {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf('\n')).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');

  const csvToArrayProgress = multibar.create(rows.length - 1, 0, {filename: `Ingesting ${filename}`})
  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  // console.warn(`Converting ${filename} to array`)
  const arr = rows.map(function (row, i) {

    if (i % 3 == 0 || i == rows.length - 1) {
      csvToArrayProgress.update(i)
      // progressBar.update(index)
      multibar.update()
      }

    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      let val = ""
      if (header == "ResourceGroup") {
        val = values[index].toUpperCase()
      } else {
        val = values[index]
      }
      object[header] = val
      return object;
    }, {});
    return el;
  });
  // multibar.remove(csvToArrayProgress)

  // return the array
  // console.log(arr);
  csvToArrayProgress.stop()
  return arr;
}

function transformDataset(dataset) {
  const transformDatasetProgress = multibar.create(dataset.length - 1, 0, {filename: `Transforming dataset`})

  const transformedData = dataset.reduce((all, item, index) => {
    if (index % 3 == 0 || index == dataset.length -1) {
      transformDatasetProgress.update(index)
      // progressBar.update(index)
      multibar.update()
    }
    // process.exit()
    let {
      ResourceGroup,
      PreTaxCost,
      SubscriptionName,
      datafile
    } = item
    let Tenant = ""

    let lcSubName = SubscriptionName.toLowerCase()

    if (lcSubName === "pud") { Tenant = "PUD" }
    else if (lcSubName === "puddtq") { Tenant = "PUDDTQ" }
    else if (lcSubName.includes("devdtq")) { Tenant = "PURPLEDTQ" }
    else if (lcSubName.includes("dev")) { Tenant = "PURPLE" }
    else if (lcSubName.includes("apcdtq")) { Tenant = "REDDTQ" }
    else if (lcSubName.includes("apc") && datafile === "reddtq") { Tenant = "REDDTQ" }
    else if (lcSubName.includes("apc") && datafile !== "reddtq") { Tenant = "RED" }
    else if (lcSubName.includes("hapdtq")) { Tenant = "BLUEDTQ" }
    else if (lcSubName.includes("hap")) { Tenant = "BLUE" }
    else if (lcSubName.includes("agd")) { Tenant = "YELLOW" }

    let resGroup = ResourceGroup === "" ? "NO_RESGRP" : ResourceGroup

    if (!all.Tenants) {
      all.Tenants = {}
      all.PreTaxCost = 0.00
    }

    if (!all.Tenants[Tenant]) {
      all.Tenants[Tenant] = {
        subscriptions: {},
        PreTaxCost: 0.00
      }
    }


    if (!Object.keys(all.Tenants[Tenant].subscriptions).includes(SubscriptionName)) {
      all.Tenants[Tenant].subscriptions[SubscriptionName] = {
        Tenant,
        PreTaxCost: 0.00,
        resGroups: {}
      }
      // console.log(item)
    }

    if (!all.Tenants[Tenant].subscriptions[SubscriptionName].resGroups[resGroup]) {
      all.Tenants[Tenant].subscriptions[SubscriptionName].resGroups[resGroup] = {
        Tenant,
        datafile,
        PreTaxCost: 0,
        usageData: [],
      }
    }

    all.Tenants[Tenant].subscriptions[SubscriptionName].PreTaxCost += parseFloat(PreTaxCost)
    all.Tenants[Tenant].subscriptions[SubscriptionName].resGroups[resGroup].PreTaxCost += parseFloat(PreTaxCost)
    all.Tenants[Tenant].PreTaxCost += parseFloat(PreTaxCost)
    all.PreTaxCost += parseFloat(PreTaxCost)

    let builtItem = {
      ResourceGroup,
      PreTaxCost,
      SubscriptionName,
      Tenant
    }

    // console.log(builtItem)

    all.Tenants[Tenant].subscriptions[SubscriptionName].resGroups[resGroup].usageData = [...all.Tenants[Tenant].subscriptions[SubscriptionName].resGroups[resGroup].usageData, builtItem]

    return all
  }, {})
  transformDatasetProgress.stop()
  multibar.update()
  return transformedData
}

function getTenantData(filename) {
  let tenantData = csvToArray(
    readFileSync(`./${filename}.txt`)
      .toString()
      .trim()
      .replaceAll('""', '')
      .replaceAll('\r', ''),
    '\t',
    filename
  )
  tenantData.forEach(el => {
    el.datafile = filename.split("_")[1]
  });
  return tenantData
}

function subCsvOut(jsonData) {
  let subscriptionCosts = Object.keys(jsonData.subscriptions)
    .map(sub => {
      return { sub: sub, cost: jsonData.subscriptions[sub].PreTaxCost }
    })

  return subscriptionCosts.reduce((all, item, index) => {
    return all += `${item.sub},${item.cost}\n`
  }, "Subscription,Cost\n")
}

function resGrpCsvOut(jsonData) {
  let tenants = Object.keys(jsonData.Tenants)
  let allSubs = []
  let allResGroups = []
  let allResGroupsByTenant = {}

  console.log("Building CSV file...")
  tenants.map(t => {
    allSubs = [...allSubs, ...Object.keys(jsonData.Tenants[t].subscriptions)]

    allSubs.map(sub => {
      // let subResGroups = Object.keys(jsonData.Tenants[t].subscriptions[sub].resGroups)
      // console.log(sub)
      // console.log(jsonData.Tenants[t].subscriptions[sub])

      if (jsonData.Tenants[t].subscriptions[sub]) {

        for (let rg in jsonData.Tenants[t].subscriptions[sub].resGroups) {
          // allResGroups = [...allResGroups, ...jsonData.Tenants[t].subscriptions[sub].resGroups[rg]]


          let resGroup = {
            resGroup: rg,
            PreTaxCost: jsonData.Tenants[t].subscriptions[sub].resGroups[rg].PreTaxCost,
            subscription: sub,
            Tenant: jsonData.Tenants[t].subscriptions[sub].resGroups[rg].Tenant,
            datafile: jsonData.Tenants[t].subscriptions[sub].resGroups[rg].datafile,
            // datafile: jsonData.Tenants[t].subscriptions[sub].resGroups[rg].datafile
          }

          // console.log(resGroup)

          allResGroups = [...allResGroups, resGroup]

          if (!allResGroupsByTenant[t]) {
            allResGroupsByTenant[t] = {
              PreTaxCost: 0.00,
              resGroups: []
            }
          }

          allResGroupsByTenant[t].resGroups = [...allResGroupsByTenant[t].resGroups, resGroup]
          allResGroupsByTenant[t].PreTaxCost += resGroup.PreTaxCost
        }
        // return
      }
      // console.log(jsonData.Tenants[t].subscriptions[sub].resGroups)
    })
  })


  function allResGroupsCsv(data) {
    let dataOut = data.reduce((all, item, index) => {
      // console.log(item)
      all += `"${item.Tenant}","${item.subscription}","${item.resGroup}","${item.PreTaxCost.toFixed(2)}"\n`
      return all
    }, '"Tenant","ResourceGroup","Subscription","PreTaxCost"\n')
    // console.log(dataOut)
    return  dataOut
  }

  function allResGroupsByTenantCsv(data) {
    const tenants = Object.keys(allResGroupsByTenant)
    let dataOut = {}
    for (const t of tenants) {
      // console.log(data[t].resGroups)
      // process.exit()
      dataOut[t] = data[t].resGroups.reduce((all, item, index) => {
        // console.log(item)
        all += `"${item.Tenant}","${item.subscription}","${item.resGroup}","${item.PreTaxCost.toFixed(2)}"\n`
        return all
      }, '"Tenant","ResourceGroup","Subscription","PreTaxCost"\n')
    }
    // console.log(dataOut)
    return dataOut
  }


  return {
    allResGroups,
    allResGroupsCsv: allResGroupsCsv(allResGroups),
    allResGroupsByTenant,
    allResGroupsByTenantCsv: allResGroupsByTenantCsv(allResGroupsByTenant)
  }
}

function mergeAllTenantData(fileNames) {
  let allTenants = []



  for (let fn of fileNames) {
    let tenantData = getTenantData(fn)
    allTenants = [...allTenants, ...tenantData]
  }

  return allTenants
}

function allXlsxOut(jsonData) {
  const wb = XLSX.utils.book_new()
}





function generateCostreport() {

  let fileNames = [
    // "monthly-cost-exports_blue",
    // "monthly-cost-exports_bluedtq",
    // "monthly-cost-exports_red",
    // "monthly-cost-exports_reddtq",
    // "monthly-cost-exports_yellow"
    "monthly-cost-exports/BLUE",
    "monthly-cost-exports/BLUEDTQ",
    "monthly-cost-exports/RED",
    "monthly-cost-exports/REDDTQ",
    "monthly-cost-exports/YELLOW"
  ]

  let mergedTenantData = mergeAllTenantData(fileNames)

  // let transformedDataset = JSON.parse(fs.readFileSync("tenantData.json"))
  let transformedDataset = transformDataset(mergedTenantData)
  // console.log(JSON.stringify(transformedDataset))
  // process.exit()

  // return transformedDataset
  multibar.stop()
  return resGrpCsvOut(transformedDataset)
}

let tenantData = generateCostreport()

for (const t of Object.keys(tenantData.allResGroupsByTenantCsv)) {
  // console.log(tenantData.allResGroupsByTenantCsv[t])
  writeFileSync(`monthly-cost-exports/${t}.csv`, tenantData.allResGroupsByTenantCsv[t])
}
// let tenantData = JSON.parse(fs.readFileSync("tenantData.json"))

// console.log(tenantData)
// let data = JSON.parse(fs.readFileSync("tenantData.json"))
// console.log(data[1])
// writeFileSync("monthly-cost-exports-complete.csv", tenantData.allResGroupsCsv)
// writeFileSync("monthly-cost-exports-complete.json", JSON.stringify(tenantData.allResGroups, null, 2))
// writeFileSync("monthly-cost-exports-complete-allRG-byTenant.json", JSON.stringify(tenantData.allResGroupsByTenant, null, 2))

// 377mb
// 37mb formatted

// const ordered = Object.keys(data.subscriptions.apcdesktop.resGroups).sort().reduce(
//   (obj, key) => {
//     obj[key] = data.subscriptions.apcdesktop.resGroups[key].PreTaxCost.toFixed(2);
//     return obj;
//   },
//   {}
// )
// const flatData = Object.keys(data.subscriptons).map(e => data[e])
// console.log(flatData)


// const printData = Object.keys(transformedDataset.subscriptions['apcdtqshared']).sort()
// const printData = transformedDataset.subscriptions['apcdtqshared']

// const data = generateCostreport("monthly-adhoc-december_red.txt")



// const filename = "monthly-cost-exports_red"

// const data = generateCostreport(`${filename}.txt`)

// writeFileSync(`${filename}.json`, JSON.stringify(data, null, 2))
// const data = JSON.parse(readFileSync(`${filename}.json`))

// let subscriptionCosts = Object.keys(data.subscriptions).map(sub => ({sub: sub, cost: data.subscriptions[sub].PreTaxCost}))

// console.log({subscriptionCosts, total: data.PreTaxCost})



// console.log(subCsvOut(data))



// console.log(resGrpCsvOut(data))

// writeFileSync(`${filename}.xlsx`, resGrpCsvOut(data))



// console.log(data.subscriptions.apcdesktop.resGroups["RG-APCDESKTOP-AIB"].PreTaxCost.toFixed(2))

// const ordered = Object.keys(data.subscriptions.apcdesktop.resGroups).sort().reduce(
//   (obj, key) => {
//     obj[key] = data.subscriptions.apcdesktop.resGroups[key].PreTaxCost.toFixed(2);
//     return obj;
//   },
//   {}
// )

// const flatData = Object.keys(ordered).map(e => ordered[e])
// console.log({
//   resGroups: ordered,
//   PreTaxCost: data.subscriptions.apcdesktop.PreTaxCost.toFixed(2),
// })

// console.log(ordered)

// console.log(data.subscriptions.apcdesktop)

// console.log(data.subscriptions.apcdesktop.resGroups["RG-APCDESKTOP-ANF"].usageData.length)



// const printData = Object.keys(transformedDataset['apcdtqshared']).sort()
// writeFileSync("monthly-cost-exports-transformed.json", JSON.stringify(transformedDataset, null, 2))
// console.log(JSON.stringify(Object.keys(transformedDataset).sort()))
// console.log(transformedDataset.subscriptions)


// console.log(printData)
// console.log(printData.length)

// console.log(Object.keys(transformedDataset).sort())


// if (!all[item.appName].includes(name)) {
//   all[item.appName] = all[item.appName] + ' - ' + name.replaceAll('"', '')
// }


// if (!all[user.SourceSamAcct]) {
//   user.applications = []
//   user.machines = []
//   all[user.SourceSamAcct] = user
// } else {
//   user.applications = [...new Set([...user.applications, item.appName])]
//   user.machines = [...new Set([...user.machines, item.machineId])]
//   all[user.SourceSamAcct] = user
// }


// const constructedFilteredList = filteredAppList.reduce((all, item, index) => {
//   all[item] = appList[item]
//   return all
// }, {})
