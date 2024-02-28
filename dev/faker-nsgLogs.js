import { faker } from '@faker-js/faker';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

faker.seed(69420)

const dataPath = "./fakedata/nsgLogs"

if (!existsSync(dataPath)) {
  mkdirSync(dataPath, { recursive: true })
}

const ipAddresses = {
  source: faker.helpers.multiple(faker.internet.ipv4, {
    count: {
      min: 40,
      max: 100000
    }
  }),
  destination: faker.helpers.multiple(faker.internet.ipv4, {
    count: {
      min: 1,
      max: 7
    }
  })
}
const fileNames = faker.helpers.uniqueArray(() => faker.string.alpha(15), 3500)
const subId = faker.string.uuid()

for (let i = 0; i < 1000; i++) {
  // console.log(i, );
  const testData = {
    records: faker.helpers.multiple(createLog, {
      count: {
        min: 10, max: 100
      }
    })
  }


  writeFileSync(`${dataPath}/${fileNames[i]}.json`, JSON.stringify(testData, null, 2))
}

function createFlowData(dateTime) {
  const timestamp = new Date(dateTime).getTime()
  return `${timestamp.toString().substring(0, 10)},${faker.helpers.arrayElement(ipAddresses.source)},${faker.helpers.arrayElement(ipAddresses.destination)},${faker.internet.port()},${faker.internet.port()},T,I,D`
}



function createLog() {
  function generateFlow() {
    return {
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
  }
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
      flows: faker.helpers.multiple(generateFlow, {
        count:
        {
          min: 1,
          max: 4
        }
      })
    }
  }
}
