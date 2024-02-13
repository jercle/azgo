import { faker } from '@faker-js/faker';


const randomName = faker.helpers.multiple(faker.internet.ipv4, {count: faker.number.int(20)})


// console.log(faker.date.recent({ days: 31 }))
console.log(faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-02-01T00:00:00.000Z' }))


const subId = faker.string.uuid()

{
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
              "1590103501,185.176.27.34,172.21.14.53,56285,33934,T,I,D"
            ]
          }
        ]
      }
    ]
  }
},
