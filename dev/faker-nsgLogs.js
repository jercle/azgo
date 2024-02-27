import { faker } from '@faker-js/faker';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

// const randomName = faker.helpers.multiple(faker.internet.ipv4, { count: faker.number.int(20) })
// console.log(faker.date.recent({ days: 31 }))
// console.log(faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-02-01T00:00:00.000Z' }))
const subId = faker.string.uuid()

const testDataPath = "./testData/nsgLogs"

if (!existsSync(testDataPath)) {
  mkdirSync(testDataPath, {recursive: true})
}


// 2020-05-21T23:26:08.7243843




const ipAddresses = {
  source: faker.helpers.multiple(faker.internet.ipv4, {
    count: {
      min: 40,
      max: 1000
    }
  }),
  destination: faker.helpers.multiple(faker.internet.ipv4, {
    count: {
      min: 1,
      max: 7
    }
  })
}


function createFlowData(dateTime) {
  const timestamp = new Date(dateTime).getTime()
  return `${timestamp.toString().substring(0, 10)},${faker.helpers.arrayElement(ipAddresses.source)},${faker.helpers.arrayElement(ipAddresses.destination)},${faker.internet.port()},${faker.internet.port()},T,I,D`
}


function createLog() {
  const dateTime = faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-02-01T00:00:00.000Z' })
  return {
    time: dateTime,
    systemId: faker.string.uuid(),
    macAddress: faker.internet.mac({ separator: "" }),
    category: "NetworkSecurityGroupFlowEvent",
    resourceId: `/SUBSCRIPTIONS/${subId}/RESOURCEGROUPS/${faker.internet.domainWord()}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/HUB1`,
    operationName: "NetworkSecurityGroupFlowEvents",
    properties: {
      Version: 1,
      flows: [
        {
          rule: "UserRule_deny-all-temp",
          flows: [
            {
              mac: faker.internet.mac({ separator: "" }),
              flowTuples:
                faker.helpers.multiple(() => createFlowData(dateTime), {
                  count: {
                    min: 1, max: 20
                  }
                })

            }
          ]
        }
      ]
    }
  }
}



const fileNames = faker.helpers.uniqueArray(() => faker.string.alpha(15), 3500)


for (let i = 0; i < 1000; i++) {
  // console.log(i, );
  const testData = faker.helpers.multiple(createLog, {
    count: {
      min: 10, max: 400
    }
  })

  writeFileSync(`${testDataPath}/${fileNames[i]}.json`, JSON.stringify(testData, null, 2))
}
