import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';

const randomName = faker.helpers.multiple(faker.internet.ipv4, {count: faker.number.int(20)})
// console.log(faker.date.recent({ days: 31 }))
// console.log(faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-02-01T00:00:00.000Z' }))

function createLog() {
  const subId = faker.string.uuid()

  return {
    time: faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-02-01T00:00:00.000Z' }),
    systemId: faker.string.uuid(),
    macAddress: faker.internet.mac({separator: ""}),
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
              mac: faker.internet.mac({separator: ""}),
              flowTuples: [
                faker.helpers.multiple(() => `1590103501,${faker.internet.ipv4()},${faker.internet.ipv4()},${faker.internet.port()},${faker.internet.port()},T,I,D`, {count: {
                  min: 1, max: 10
                }})
              ]
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
  const testData = faker.helpers.multiple(createLog, {count: {
    min: 100, max: 1000
  }})

  writeFileSync(`../testData/nsgLogs/${fileNames[i]}.json`, JSON.stringify(testData, null, 2))
}
