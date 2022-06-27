import { stringify } from "yaml"
import { writeFileSync } from "fs"

import { fileURLToPath } from "url"
import { dirname } from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


    // AZGO_SUBSCRIPTION_ID
    // AZGO_BASE_NAME
    // AZGO_APP_ENV
    // AZGO_SUB_ENV
    // AZGO_APP_NAME-RG


export default function generatePipeline({appName, envs, subscriptionId,}) {

}

let pipelineVars = [
  {
    name: "subscriptionId",
    value: "23310d40-a0d5-4446-8433-d0e6b151c2ab",
  },
  {
    name: "resourceGroupName",
    value: "DMZ-NonProd-Dev-AHDB-RG",
  },
  {
    name: "serviceConnection",
    value: "DMZ-NonProd-Dev-DevOps-AHDB-SC",
  },
  {
    name: "keyVaultName",
    value: "DMZ-NonProd-D-AHDB-KV",
  },
  {
    name: "resourceObjectId",
    value: "a221184c-4a0a-44b1-8c97-0f11305d4f8c",
  },
  {
    name: "applicationInsightsName",
    value: "DMZ-NonProd-Dev-AHDB-ai",
  },
  {
    name: "hostingPlanName",
    value: "DMZ-NonProd-Dev-AHDB-ASP",
  },
  {
    name: "aspResourceGroup",
    value: "DMZ-NonProd-Dev-AHDB-RG",
  },
  {
    name: "skuName",
    value: "P1v3",
  },
  {
    name: "hostingPlanKind",
    value: "linux",
  },
  {
    name: "location",
    value: "Australia East",
  },
  {
    name: "reserved",
    value: "true",
  },
  {
    name: "hyperV",
    value: false,
  },
  {
    name: "networkResourceGroupName",
    value: "dmz-nonprod-1-net-rg",
  },
  {
    name: "networkVnetName",
    value: "dmz-nonprod-1-vnet1",
  },
  {
    name: "networkSubnetName",
    value: "dmz-nonprod-AHDB-ip",
  },
  {
    name: "webAppName",
    value: "DMZ-NonProd-Dev-AHDB-site",
  },
  {
    name: "webAppKind",
    value: "app,linux,container",
  },
  {
    name: "osVersion",
    value: "linux",
  },
  {
    name: "stagingSlotName",
    value: "staging",
  },
  {
    name: "dockerRegistryUrl",
    value: "https://mcr.microsoft.com",
  },
  {
    name: "dockerImageName",
    value: "mcr.microsoft.com/appsvc/staticsite:latest",
  },
  {
    name: "appGatewayRuleName",
    value: "Allow-NonProd-AppGW01-in",
  },
  {
    name: "appGatewayRuleIPAddress1",
    value: "172.25.2.10/32",
  },
  {
    name: "appGatewayRuleIPAddress2",
    value: "20.53.68.194/32",
  },
  {
    name: "storageAccountName",
    value: "dmznonproddevahdb",
  },
  {
    name: "storageAccountType",
    value: "Standard_LRS",
  },
  {
    name: "fileShareName",
    value: "ahdbmount",
  },
  {
    name: "shareQuota",
    value: "1",
  },
  {
    name: "mountPath",
    value: "/app",
  },
]

const appInsights = {
  name: "AppInsights",
  templateFolder: "Microsoft.Insights",
  templateFile: "Microsoft.Insights.Components.json",
  parameters: [
    {
      name: "applicationInsightsName",
      value: "#{applicationInsightsName}#",
    },
    {
      name: "keyVaultName",
      value: "#{keyVaultName}#",
    },
  ],
}

const keyVaultPolicies = {
  name: "keyvaultpolicies",
  templateFolder: "Microsoft.KeyVault",
  templateFile: "Microsoft.KeyVault.AccessPolicies.json",
  parameters: [
    {
      name: "keyVaultName",
      value: "#{keyVaultName}#",
    },
    {
      name: "resourceObjectId",
      value: "#{serviceConnectionObjectId}#",
    },
    {
      name: "secretsPermissions",
      value: ["Get", "List", "Set"],
    },
  ],
}

const hostingPlan = {
  name: "HostingPlan",
  templateFolder: "Microsoft.Web",
  templateFile: "Microsoft.Web.ServerFarms.Container.json",
  parameters: [
    {
      name: "hostingPlanName",
      value: "#{hostingPlanName}#",
    },
    {
      name: "skuName",
      value: "#{skuName}#",
    },
    {
      name: "kind",
      value: "#{hostingPlanKind}#",
    },
    {
      name: "reserved",
      value: true,
    },
    {
      name: "hyperV",
      value: false,
    },
    {
      name: "location",
      value: "#{location}#",
    },
  ],
}

const webAppContainer = {
  name: "WebAppContainer",
  templateFolder: "Microsoft.Web",
  templateFile: "Microsoft.Web.Sites.Container.json",
  parameters: [
    {
      name: "appName",
      value: "#{webAppName}#",
    },
    {
      name: "applicationInsightsInstrumentationKey",
      value: "[reference('AppInsights').outputs.instrumentationKey.value]",
    },
    {
      name: "applicationInsightsName",
      value: "#{applicationInsightsName}#",
    },
    {
      name: "kind",
      value: "#{webAppKind}#",
    },
    {
      name: "omsWorkspaceRG",
      value: "#{omsWorkspaceRG}#",
    },
    {
      name: "omsWorkspaceName",
      value: "#{omsWorkspaceName}#",
    },
    {
      name: "keyVaultName",
      value: "#{keyVaultName}#",
    },
    {
      name: "secretPermissions",
      value: ["Get", "List", "Set"],
    },
    {
      name: "addDiagnosticSettings",
      value: true,
    },
    {
      name: "osVersion",
      value: "#{osVersion}#",
    },
    {
      name: "hostingPlanName",
      value: "#{hostingPlanName}#",
    },
    {
      name: "aspResourceGroup",
      value: "#{aspResourceGroup}#",
    },
    {
      name: "dockerImageName",
      value: "#{dockerImageName}#",
    },
    {
      name: "dockerRegistryUrl",
      value: "#{dockerRegistryUrl}#",
    },
    {
      name: "dockerRegistryUsername",
      value: "#{dockerRegistryUsername}#",
    },
    {
      name: "dockerRegistryPassword",
      value: "#{dockerRegistryPassword}#",
    },
    {
      name: "stagingSlotName",
      value: "#{stagingSlotName}#",
    },
    {
      name: "networkResourceGroupName",
      value: "#{networkResourceGroupName}#",
    },
    {
      name: "networkVnetName",
      value: "#{networkVnetName}#",
    },
    {
      name: "networkSubnetName",
      value: "#{networkSubnetName}#",
    },
    {
      name: "configCustom",
      value: {
        WEBSITES_PORT: 8080,
      },
    },
    {
      name: "alwaysOn",
      value: true,
    },
  ],
}

const webAppAccessRestrictions = {
  name: "accessRestrictions",
  value: [
    {
      ipAddress: "#{appGatewayRuleIPAddress1}#",
      action: "Allow",
      priority: 10,
      name: "#{appGatewayRuleName}#",
    },
    {
      ipAddress: "#{appGatewayRuleIPAddress2}#",
      action: "Allow",
      priority: 20,
      name: "#{appGatewayRuleName}#",
    },
    {
      ipAddress: "124.47.163.185/32",
      action: "Allow",
      priority: 30,
      name: "Allow-AGSIG-In",
    },
    {
      ipAddress: "143.188.220.0/23",
      action: "Allow",
      priority: 40,
      name: "Allow-AGSIG-In",
    },
    {
      ipAddress: "103.232.117.47/32",
      action: "Allow",
      priority: 50,
      name: "Allow-EnvSIG-In",
    },
    {
      ipAddress: "124.47.132.150/32",
      action: "Allow",
      priority: 60,
      name: "Allow-EnvSIG-In",
    },
    {
      ipAddress: "124.47.166.168/29",
      action: "Allow",
      priority: 70,
      name: "Allow-EnvSIG-In",
    },
    {
      ipAddress: "124.47.166.200/29",
      action: "Allow",
      priority: 80,
      name: "Allow-EnvSIG-In",
    },
    {
      ipAddress: "124.47.166.208/28",
      action: "Allow",
      priority: 90,
      name: "Allow-EnvSIG-In",
    },
    {
      ipAddress: "55.187.0.0/16",
      action: "Allow",
      priority: 100,
      name: "Allow-EnvSIG-In",
    },
    {
      ipAddress: "147.66.0.0/16",
      action: "Allow",
      priority: 110,
      name: "Allow-EnvSIG-In",
    },
  ],
}

const storageAccount = {
  name: "Storage",
  templateFolder: "Microsoft.Storage",
  templateFile: "Microsoft.Storage.StorageAccounts.json",
  parameters: [
    {
      name: "storageAccountName",
      value: "#{storageAccountName}#",
    },
    {
      name: "storageAccountType",
      value: "#{storageAccountType}#",
    },
    {
      name: "allowBlobPublicAccess",
      value: false,
    },
    {
      name: "defaultNetworkAclAction",
      value: "Deny",
    },
    {
      name: "keyVaultName",
      value: "#{keyVaultName}#",
    },
    {
      name: "appIPRules",
      value: [
        {
          value: "124.47.132.150",
        },
        {
          value: "124.47.166.168",
        },
        {
          value: "124.47.166.200",
        },
        {
          value: "124.47.166.208",
        },
        {
          value: "55.187.0.0",
        },
        {
          value: "147.66.0.0",
        },
      ],
    },
    {
      name: "vNetRules",
      value: [
        {
          id: "/subscriptions/#{subscriptionId}#/resourceGroups/#{networkResourceGroupName}#/providers/Microsoft.Network/virtualNetworks/#{networkVnetName}#/subnets/#{networkSubnetName}#",
          action: "Allow",
          state: "Succeeded",
        },
      ],
    },
  ],
}

const fileService = {
  name: "FileService",
  templateFolder: "Microsoft.Storage",
  templateFile: "Microsoft.Storage.StorageAccounts.FileServices.json",
  parameters: [
    {
      name: "storageAccountName",
      value: "#{storageAccountName}#",
    },
  ],
}

const fileServiceShare = {
  name: "FileServiceShare",
  templateFolder: "Microsoft.Storage",
  templateFile: "Microsoft.Storage.StorageAccounts.FileServices.Shares.json",
  parameters: [
    {
      name: "fileShareName",
      value: "#{fileShareName}#",
    },
    {
      name: "storageAccountName",
      value: "#{storageAccountName}#",
    },
    {
      name: "shareQuota",
      value: "[int('#{shareQuota}#')]",
    },
  ],
}

let azurePipelinesPlatform = {
  trigger: "none",
  resources: {
    repositories: [
      {
        repository: "templates",
        type: "git",
        name: "DevOps Pipeline Templates/Templates",
        ref: "main",
      },
    ],
  },
  extends: {
    template: "/pipelines/platform-azure-deploy.yml@templates",
    parameters: {
      armConfigPath: "pipelines/armConfig.json",
      environments: [
        {
          name: "AWE_DMZ_D",
          pool: "DMZ-NonProd-Dev",
          variablesTemplate: "variables/variables-dev.yml",
          serviceConnection: "DMZ-NonProd-Dev-DevOps-AHDB-SC",
          templateResourceGroup: "$(resourceGroupName)",
          targetResourceGroup: "$(resourceGroupName)",
        },
        {
          name: "AWE_DMZ_NP",
          pool: "DMZ-NonProd-Dev",
          variablesTemplate: "variables/variables-test.yml",
          serviceConnection: "DMZ-NonProd-Test-DevOps-AHDB-SC",
          templateResourceGroup: "$(resourceGroupName)",
          targetResourceGroup: "$(resourceGroupName)",
          dependsOn: ["AWE_DMZ_D"],
        },
      ],
    },
  },
}
