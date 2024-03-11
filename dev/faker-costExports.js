import {faker} from '@faker-js/faker'
import {writeFileSync, existsSync, mkdirSync, readFileSync} from 'fs'
import {format} from 'date-fns'

// faker.seed(69420)

const dataPath = './fakedata/cost-exports'

if (!existsSync(dataPath)) {
  mkdirSync(dataPath, {recursive: true})
}
let AccountName = faker.company.name()
let AccountOwnerId = faker.string.uuid()
let DepartmentName = faker.helpers.arrayElement(['Engineering', 'Sales', 'Marketing', 'Finance', 'HR'])
// let subIds = faker.helpers.multiple(faker.string.uuid, {count: 7})
let subs = {
  red: ['apc', 'apc2', 'apc3', 'pud10'],
  reddtq: ['apcdtq', 'apcdtq5', 'puddtq'],
  blue: ['hap6', 'hap'],
  bluedtq: ['hapdtq8', 'hapdtq9'],
  purple: ['dev', 'dev1', 'dev2', 'dev3'],
  purpledtq: ['devdtq', 'devdtq1', 'devdtq2', 'devdtq3'],
  yellow: ['yellow', 'yellow1', 'yellow2', 'yellow3'],
}

// let subs = faker.helpers.multiple(() => {
//   return {
//     SubscriptionGuid: faker.string.uuid(),
//     SubscriptionName: faker.company.companyName(),
//   }
// })
// let subs = subNames.map((name) => {
//   return {
//     SubscriptionGuid: faker.string.uuid(),
//     SubscriptionName: name,
//   }
// })

function generateCostExport(subs) {
  // let env = faker.helpers.arrayElement(['red', 'blue', 'purple'])
  // let sub = faker.helpers.arrayElement(subs)
  for (const sub of Object.keys(subs)) {
    // console.log(sub)
    generateTenantCostExport(sub)
  }
  // return {
  //   DepartmentName,
  //   AccountName,
  //   AccountOwnerId,
  //   SubscriptionGuid: sub.SubscriptionGuid,
  //   SubscriptionName: sub.SubscriptionName,
  //   ResourceGroup: '',
  //   ResourceLocation: '',
  //   AvailabilityZone: '',
  //   UsageDateTime: '',
  //   ProductName: '',
  //   MeterCategory: '',
  //   MeterSubcategory: '',
  //   MeterId: '',
  //   MeterName: '',
  //   MeterRegion: '',
  //   UnitOfMeasure: '',
  //   UsageQuantity: '',
  //   ResourceRate: '',
  //   PreTaxCost: '',
  //   CostCenter: '',
  //   ConsumedService: '',
  //   ResourceType: '',
  //   InstanceId: '',
  //   Tags: '',
  //   OfferId: '',
  //   AdditionalInfo: '',
  //   ServiceInfo1: '',
  //   ServiceInfo2: '',
  //   Currency: '',
  // }
}

function generateTenantCostExport(sub) {
  // console.log(subs)
  let subscriptions = []
  for (const subName of subs[sub]) {
    // console.log(subName)
    subscriptions.push({
      SubscriptionGuid: faker.string.uuid(),
      SubscriptionName: subName,
    })
  }

  let costExportRows = []

  for (let i = 0; i < 1000; i++) {
    // console.log(i, );
    costExportRows.push(generateCostExportRow(subscriptions))
    // const testData = {
    //   records: faker.helpers.multiple(createLog, {
    //     count: {
    //       min: 10, max: 100
    //     }
    //   })
    // }
    // writeFileSync(`${dataPath}/${fileNames[i]}.json`, JSON.stringify(testData, null, 2))
  }

  console.log(costExportRows)
}

// for (let i = 0; i < 1000; i++) {
// console.log(i, );
// const testData = {
//   records: faker.helpers.multiple(createLog, {
//     count: {
//       min: 10, max: 100
//     }
//   })
// }
// writeFileSync(`${dataPath}/${fileNames[i]}.json`, JSON.stringify(testData, null, 2))
// }

function generateCostExportRow(subs) {
  const sub = faker.helpers.arrayElement(subs)
  const ResourceGroups = [
    `rg-${sub.SubscriptionName}-azdo`,
    `rg-${sub.SubscriptionName}-aks`,
    `rg-${sub.SubscriptionName}-appgw`,
    `rg-${sub.SubscriptionName}-appsvc`,
    `rg-${sub.SubscriptionName}-desktop`,
    `rg-${sub.SubscriptionName}-aib`,
    `rg-${sub.SubscriptionName}-config`,
  ]

  const UsageDateTime = format(
    new Date(faker.date.between({from: '2024-02-01T00:00:00.000Z', to: '2024-03-01T00:00:00.000Z'})),
    'yyyy-MM-dd',
  )

  return {
    DepartmentName,
    AccountName,
    AccountOwnerId,
    SubscriptionGuid: sub.SubscriptionGuid,
    SubscriptionName: sub.SubscriptionName,
    ResourceGroup: faker.helpers.arrayElement(ResourceGroups),
    ResourceLocation: 'AU East',
    AvailabilityZone: '',
    UsageDateTime,
    ProductName: '',
    MeterCategory: '',
    MeterSubcategory: '',
    MeterId: '',
    MeterName: '',
    MeterRegion: '',
    UnitOfMeasure: '',
    UsageQuantity: '',
    ResourceRate: '',
    PreTaxCost: '',
    CostCenter: '',
    ConsumedService: '',
    ResourceType: '',
    InstanceId: '',
    Tags: '',
    OfferId: '',
    AdditionalInfo: '',
    ServiceInfo1: '',
    ServiceInfo2: '',
    Currency: '',
  }
}

generateCostExport(subs)
// let costExportRow = generateCostExportRow()
console.log('Generating cost-exports data...')
// console.log(JSON.stringify(costExportRow, null, 2))
// console.log(SubscriptionGuid)
