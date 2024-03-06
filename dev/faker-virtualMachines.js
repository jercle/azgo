import { faker } from '@faker-js/faker';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';

const allVms = {
  value: [
    {
      name: "test",
      id: "/subscriptions/bae338c7-6098-4d52-b173-e2147e107dfa/resourceGroups/DEFAULTRESOURCEGROUP-EAU/providers/Microsoft.Compute/virtualMachines/test",
      type: "Microsoft.Compute/virtualMachines",
      location: "australiaeast",
      properties: {
        hardwareProfile: {
          vmSize: "Standard_D2s_v3"
        },
        provisioningState: "Succeeded",
        vmId: "569591c0-e424-472b-8d29-8cb9b7979bd2",
        additionalCapabilities: {
          hibernationEnabled: false
        },
        storageProfile: {
          imageReference: {
            publisher: "canonical",
            offer: "0001-com-ubuntu-server-focal",
            sku: "20_04-lts-gen2",
            version: "latest",
            exactVersion: "20.04.202402290"
          },
          osDisk: {
            osType: "Linux",
            name: "test_OsDisk_1_0788df7ac49d4ca0931a77437e8af4cf",
            createOption: "FromImage",
            caching: "ReadWrite",
            managedDisk: {
              id: "/subscriptions/bae338c7-6098-4d52-b173-e2147e107dfa/resourceGroups/DefaultResourceGroup-EAU/providers/Microsoft.Compute/disks/test_OsDisk_1_0788df7ac49d4ca0931a77437e8af4cf"
            },
            deleteOption: "Delete"
          },
          dataDisks: [],
          diskControllerType: "SCSI"
        },
        osProfile: {
          computerName: "test",
          adminUsername: "azureuser",
          linuxConfiguration: {
            disablePasswordAuthentication: true,
            ssh: {
              publicKeys: [
                {
                  path: "/home/azureuser/.ssh/authorized_keys",
                  keyData: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDzUtcNVWnzWz1lrSJj2erzI3c/ECZCVaSJsrDx09VxOrEe3dgxl2CVOEQSCobtbPNQMT+PorWKuHTXuXJ2Pn6mOMNu1fEF5pxGiF+biPy13Qxe+TPhuNu99XMmeWbAuTXinHDh3PtvQ4BerNY/SWRi1EFXNfi65KIs7qaNPdsA5OcC0kMLQ6OkgUFdhGoZBgKWrzTI/4fwpKcT6YPP/rm3yUhnxisBf82uOXnm/lZmHYRednRDL8NdZXrggZ8u8G+6eMTXNjlePhkPEOo3eqEHgCdgG4UGXPEirB9oTcUhwNi59ZazaZGUr9QtYivJsqVMWajT0eJE6+yZhmjnB+4KR2X0ap6YoUvyF90iGEPDM8qZrcow+K7q+V0yLKApIeKofSTC/A0oOcgeH7MhsOkxPbpA0WXsfXW4T9MNdlWqv5yk1DOIa12EmQVE9GloNAxr+oBmbWMk7cHPhXoo4Ot1h58W9/F27+lugSrbAbwF5RkheSOhcyPD9Me3dk2iRjU= generated-by-azure"
                }
              ]
            },
            provisionVMAgent: true,
            patchSettings: {
              patchMode: "AutomaticByPlatform",
              automaticByPlatformSettings: {
                rebootSetting: "IfRequired",
                bypassPlatformSafetyChecksOnUserSchedule: false
              },
              assessmentMode: "ImageDefault"
            },
            enableVMAgentPlatformUpdates: false
          },
          secrets: [],
          allowExtensionOperations: true,
          requireGuestProvisionSignal: true
        },
        securityProfile: {
          uefiSettings: {
            secureBootEnabled: true,
            vTpmEnabled: true
          },
          securityType: "TrustedLaunch"
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/bae338c7-6098-4d52-b173-e2147e107dfa/resourceGroups/DefaultResourceGroup-EAU/providers/Microsoft.Network/networkInterfaces/test935_z1",
              properties: {
                deleteOption: "Detach"
              }
            }
          ]
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            enabled: true
          }
        },
        timeCreated: "2024-03-06T11:31:00.0363157+00:00"
      },
      zones: [
        "1"
      ]
    }
  ]
}

const subscriptionId = faker.string.uuid()
let resGrpArr = []
resGrpArr.push(`rg-${faker.hacker.ingverb()}`)
resGrpArr.push(`rg-${faker.hacker.ingverb()}`)
resGrpArr.push(`rg-${faker.hacker.ingverb()}`)
resGrpArr.push(`rg-${faker.hacker.ingverb()}`)
resGrpArr.push(`rg-${faker.hacker.ingverb()}`)
resGrpArr.push(`rg-${faker.hacker.ingverb()}`)

const vmSizes = JSON.parse(readFileSync("vmSizes.json")).map(s => s.name)
// console.log(vmSizes)


function createVirtualMachine(subscriptionId, resGroupArr, vmSizes) {
  const resourceGroup = faker.helpers.arrayElement(resGrpArr)
  const osDiskName = `${faker.hacker.noun()}_OsDisk_1_${faker.string.uuid()}`
  const virtualMachine = {
    name: faker.lorem.slug(),
    id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Compute/virtualMachines/${faker.hacker.verbs()}`,
    type: "Microsoft.Compute/virtualMachines",
    location: "australiaeast",
    properties: {
      hardwareProfile: {
        vmSize: faker.helpers.arrayElement(vmSizes)
      },
      provisioningState: "Succeeded",
      vmId: faker.string.uuid(),
      additionalCapabilities: {
        hibernationEnabled: faker.helpers.arrayElement([true, false])
      },
      storageProfile: {
        imageReference: {
          publisher: "Microsoft",
          offer: "o365",
          sku: "o365-prod-multi-session-w10",
          version: "0.0.78",
          exactVersion: "0.0.78",
        }
        "osDisk": {
          osType: "Windows",
          name: osDiskName,
          createOption: "FromImage",
          caching: "ReadWrite",
          managedDisk: {
            id: `/subscriptions/${subscriptionId}/resourceGroups/${faker.helpers.arrayElement(resGrpArr)}/providers/Microsoft.Compute/disks/${osDiskName}`
          },
          deleteOption: "Delete"
        }
      }
      }
    }
  }
}


// const print = faker.lorem.slug()

// console.log(print)
