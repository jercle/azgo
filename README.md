# Azure Tooling
- [Azure Tooling](#azure-tooling)
  - [Function of this CLI](#function-of-this-cli)
  - [Installation](#installation)
  - [Authentication](#authentication)
  - [Usage](#usage)
    - [Set current subscription](#set-current-subscription)
    - [List all subscriptions](#list-all-subscriptions)
    - [List Files Within File Share](#list-files-within-file-share)
    - [List Keyvault Secrets](#list-keyvault-secrets)
    - [Get App Service Plan Info](#get-app-service-plan-info)
    - [List App Service Configuration](#list-app-service-configuration)
  - [Build Package](#build-package)
    - [Running the binary](#running-the-binary)

## Function of this CLI
This CLI has been created to add additional functionality to [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/) such as data aggregation from multiple `az` commands, reporting, and pulling data from both Azure DevOps and Azure.

Some of the reporting functionality is around container vulnerability scanning with the ability to install a web portal as an Azure Web App in development

This CLI is still very much under development, and functions with the `test-` prefix are considered not yet ready

This is my first public project, so any advice is appreciated and taken onboard.

## Installation

First clone the repo
```bash
git clone git@github.com:jERCle/azure-tooling.git

```

Then install required plugins (currently only `yargs`, `yargonaut`, and `readline-sync`)

```bash
cd azure-tooling && npm install -g
```

## Authentication
You must be logged in with `azure cli` as this uses the authentication provided by the user currently logged into Azure CLI



## Usage
### Set current subscription
Provides a small UI wrapper over `az subscription set` to select current active subscription. Gives a list of available subscriptions without the need to find the required ID and past into a flag

```azure subs select```

### List all subscriptions
Lists all subscriptions currently configured with `az login`. Similar to `az account list` but groups by TenantID

```
azure subs
```

Output:
```json
[
  {
    "name": "NAME1",
    "subscriptionId": "00000000-0000-0000-0000-000000000000"
  },
  {
    "name": "NAME2",
    "subscriptionId": "00000000-0000-0000-0000-000000000000"
  }
]
```

### List Files Within File Share
```
azure ls -n <share name> -c <connection string>
```

Output:
```json
[
  "...",
  {
    "name": "DEMO_20418320215715517421919197105_1.kml",
    "lastModified": "2022-02-24T02:42:43.000Z"
  },
  "..."
]
```


### List Keyvault Secrets
```
azure secrets -n <appName> -e <appEnv> -s <subscription ID>
```

Output:
```json
[
  "...",
  {
    "secretName": "dockerRegistryUsername",
    "createdOn": "2022-02-03T02:43:26.000Z",
    "updatedOn": "2022-02-03T02:43:26.000Z",
    "id": "https://KV_NAME.vault.azure.net/secrets/dockerRegistryUsername/018247089124702847"
  },
  "..."
]
```


### Get App Service Plan Info
```
azure asp -n <appName> -e <appEnv> -s <subscription ID>
```

Output:
```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/RESOURCE_GROUP/providers/Microsoft.Web/serverfarms/APP_SERVICE_PLAN",
  "name": "APP_SERVICE_PLAN",
  "kind": "linux",
  "location": "Australia East",
  "type": "Microsoft.Web/serverfarms",
  "tags": {},
  "sku": {
    "name": "P1v3",
    "tier": "PremiumV3",
    "size": "P1v3",
    "family": "Pv3",
    "capacity": 1
  },
  "workerTierName": null,
  "status": "Ready",
  "subscription": "00000000-0000-0000-0000-000000000000",
  "hostingEnvironmentProfile": null,
  "maximumNumberOfWorkers": 30,
  "geoRegion": "Australia East",
  "perSiteScaling": false,
  "elasticScaleEnabled": false,
  "maximumElasticWorkerCount": 1,
  "numberOfSites": 1,
  "isSpot": false,
  "spotExpirationTime": null,
  "freeOfferExpirationTime": null,
  "resourceGroup": "RESOURCE_GROUP",
  "reserved": true,
  "isXenon": false,
  "hyperV": false,
  "targetWorkerCount": 0,
  "targetWorkerSizeId": 0,
  "provisioningState": "Succeeded",
  "kubeEnvironmentProfile": null,
  "zoneRedundant": false
}
```

### List App Service Configuration
```
azure app -n <appName> -e <appEnv> -s <subscription ID>
```

Output:
```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/RESOURCE_GROUP/providers/Microsoft.Web/sites/APP_SERVICE/config/web",
  "name": "APP_SERVICE",
  "type": "Microsoft.Web/sites/config",
  "numberOfWorkers": 1,
  "defaultDocuments": [
    "Default.htm",
    "Default.html",
    "Default.asp",
    "index.htm",
    "index.html",
    "iisstart.htm",
    "default.aspx",
    "index.php",
    "hostingstart.html"
  ],
  "netFrameworkVersion": "v4.0",
  "phpVersion": "",
  "pythonVersion": "",
  "nodeVersion": "",
  "powerShellVersion": "",
  "linuxFxVersion": "DOCKER|USER/IMAGE:TAG",
  "windowsFxVersion": null,
  "requestTracingEnabled": false,
  "remoteDebuggingEnabled": false,
  "remoteDebuggingVersion": "VS2019",
  "httpLoggingEnabled": true,
  "acrUseManagedIdentityCreds": true,
  "acrUserManagedIdentityID": "",
  "logsDirectorySizeLimit": 80,
  "detailedErrorLoggingEnabled": false,
  "publishingUsername": "$",
  "appSettings": null,
  "connectionStrings": null,
  "machineKey": null,
  "handlerMappings": null,
  "documentRoot": null,
  "scmType": "None",
  "use32BitWorkerProcess": true,
  "webSocketsEnabled": false,
  "alwaysOn": true,
  "javaVersion": null,
  "javaContainer": null,
  "javaContainerVersion": null,
  "appCommandLine": "",
  "managedPipelineMode": "Integrated",
  "virtualApplications": [
    {
      "virtualPath": "/",
      "physicalPath": "site\\wwwroot",
      "preloadEnabled": true,
      "virtualDirectories": null
    }
  ],
  "loadBalancing": "LeastRequests",
  "experiments": {
    "rampUpRules": []
  },
  "limits": null,
  "autoHealEnabled": false,
  "autoHealRules": null,
  "tracingOptions": null,
  "vnetName": "VNET_OR_SUBNET_NAME",
  "vnetRouteAllEnabled": false,
  "vnetPrivatePortsCount": 0,
  "cors": {
    "allowedOrigins": null,
    "supportCredentials": false
  },
  "push": null,
  "apiDefinition": null,
  "apiManagementConfig": null,
  "autoSwapSlotName": null,
  "localMySqlEnabled": false,
  "managedServiceIdentityId": 27098,
  "xManagedServiceIdentityId": null,
  "keyVaultReferenceIdentity": null,
  "ipSecurityRestrictions": [
    {
      "ipAddress": "10.0.0.1/32",
      "action": "Allow",
      "tag": "Default",
      "priority": 10,
      "name": "Allow-in"
    },
    {
      "ipAddress": "Any",
      "action": "Deny",
      "priority": 2147483647,
      "name": "Deny all",
      "description": "Deny all access"
    }
  ],
  "scmIpSecurityRestrictions": [
    {
      "ipAddress": "Any",
      "action": "Allow",
      "priority": 1,
      "name": "Allow all",
      "description": "Allow all access"
    }
  ],
  "scmIpSecurityRestrictionsUseMain": false,
  "http20Enabled": false,
  "minTlsVersion": "1.2",
  "scmMinTlsVersion": "1.0",
  "ftpsState": "Disabled",
  "preWarmedInstanceCount": 0,
  "functionAppScaleLimit": 0,
  "healthCheckPath": null,
  "functionsRuntimeScaleMonitoringEnabled": false,
  "websiteTimeZone": null,
  "minimumElasticInstanceCount": 0,
  "azureStorageAccounts": {
    "logmount": {
      "type": "AzureFiles",
      "accountName": "storageaccountname",
      "shareName": "sharename",
      "accessKey": null,
      "mountPath": "/usr/local/tomcat/logs",
      "state": "Ok"
    }
  },
  "publicNetworkAccess": null,
  "location": "Australia East",
  "tags": {}
}
```


<!--

#### Examples


### Delete an app in Azure DevOps
```
ado delete -n APPNAME
```
Output:
```json
{
  "runTime": "15/7/2021 16:22:55 AEST",
  "repo": {
    "type": "repository",
    "name": "APPNAME",
    "exists": true,
    "status": 200,
    "statusText": "OK",
    "id": "",
    "projectName": "PROJECT_NAME",
    "webUrl": {
      "href": "https://dev.azure.com/ORG_NAME/PROJECT_NAME/_git/APPNAME"
    }
  },
  "groups": {
    "allGroups": 10,
    "appGroups": 4,
    "deletedGroups": [
      "APPNAME Admins",
      "APPNAME Contributors",
      "APPNAME Team",
      "APPNAME Readers"
    ],
    "postDeleteAllGroups": 6,
    "postDeleteAppGroups": 0
  }
}
```
#### Examples
 -->

## Build Package
**Node: NodeJS is required to package app**

Install the following package `pkg` globally
```bash
npm install -g pkg
```
`pkg` is created by Vercel - doco available at https://github.com/vercel/pkg

While in the root of the project, run the following:
```bash
pkg .
```
This will use the default configuration and output binaries for Windows, Linux, and macOS

### Running the binary
`./[app-name] create` is identical to running `node .` from root of source
