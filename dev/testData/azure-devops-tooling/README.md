# DAW DMZ Migration Tooling
- [DAW DMZ Migration Tooling](#daw-dmz-migration-tooling)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
    - [Create an app in Azure DevOps](#create-an-app-in-azure-devops)
      - [Examples](#examples)
    - [Delete an app in Azure DevOps](#delete-an-app-in-azure-devops)
      - [Examples](#examples-1)
  - [Build Package](#build-package)
    - [Running the binary](#running-the-binary)
## Installation

First clone the repo
```bash
git clone git@github.com:jERCle/a23-dawe-dmz-migration-tooling.git

```

Then install required plugins (currently only `yargs`, `yargonaut`, and `readline-sync`)

```bash
cd a23-dawe-dmz-migration-tooling && npm install -g
```


## Configuration
A JSON file named `vars.json` containing your personal access token can be used, placed in the same directory as the packaged app or in the source code root.
```json
{
  "pat": "rgpjke5il2x4ufndnjzaac2o4keunhuvww22jdti43jzxjxq7x6a"
}

```


## Usage

### Create an app in Azure DevOps
```
ado create -n eCert
```

Output:
```json
{
  "runTime": "Last Sync: 15/7/2021@16:21:12",
  "team": {
    "type": "team",
    "status": 201,
    "statusText": "Created",
    "id": "28daa76e-e67e-4439-aa25-6242814f2034",
    "name": "[Legacy DMZ Playground]\\eCert Team",
    "descriptor": "Microsoft.TeamFoundation.Identity;S-1-9-1551374245-4198280866-3243240780-3042756410-602209435-1-1239125218-1193268298-2897714130-3132977555"
  },
  "repo": {
    "type": "repository",
    "status": 201,
    "statusText": "Created",
    "id": "1771c4fb-73af-48af-b3b4-52e0d51431e2",
    "name": "eCert",
    "sshUrl": "git@ssh.dev.azure.com:v3/stackcats/Legacy%20DMZ%20Playground/eCert",
    "webUrl": "https://dev.azure.com/stackcats/Legacy%20DMZ%20Playground/_git/eCert"
  },
  "branch": {
    "type": "branch",
    "name": "refs/heads/main",
    "status": 201,
    "statusText": "Created",
    "repoId": "1771c4fb-73af-48af-b3b4-52e0d51431e2",
    "commitId": "519b1a88902cfa16961a758b9da6fdda278b13c4",
    "commitWebUrl": "https://dev.azure.com/stackcats/blank/_git/a/commit/519b1a88902cfa16961a758b9da6fdda278b13c4",
    "repoWebUrl": "https://dev.azure.com/stackcats/Legacy DMZ Playground/_git/eCert"
  },
  "policy": {
    "repoId": "1771c4fb-73af-48af-b3b4-52e0d51431e2",
    "status": 200,
    "statusText": "OK",
    "matchKind": "Exact",
    "refName": "refs/heads/main",
    "displayName": "Minimum number of reviewers"
  },
  "groups": [
    {
      "description": "Admins for eCert repo",
      "displayName": "eCert Admins",
      "principalName": "[Legacy DMZ Playground]\\eCert Admins",
      "id": "493d6065-b1ac-405f-bdaf-0ac19507840f",
      "descriptor": "vssgp.Uy0xLTktMTU1MTM3NDI0NS00Mjc2NDEwNTAwLTExODg5NDc3NzktMjM4Nzc4ODE5MC03MjIwNDQ5MzYtMS0xMjAyODE0Mzc1LTE1NDExNDQ2NDktMjM4MTM4MjIwMC00NDg3MTgyMjE"
    },
    {
      "description": "Read access to eCert repo",
      "displayName": "eCert Readers",
      "principalName": "[Legacy DMZ Playground]\\eCert Readers",
      "id": "7996caa6-76d2-47f3-8e56-e9115c3d6708",
      "descriptor": "vssgp.Uy0xLTktMTU1MTM3NDI0NS00Mjc2NDEwNTAwLTExODg5NDc3NzktMjM4Nzc4ODE5MC03MjIwNDQ5MzYtMS00MDA4NzkzMTgtNzQ1NzUwMzQ5LTIyMDQ3NjQxNzUtMTU0NjE3NjI2MA"
    },
    {
      "description": "Contributor group for eCert",
      "displayName": "eCert Contributors",
      "principalName": "[Legacy DMZ Playground]\\eCert Contributors",
      "id": "108001d9-95d0-440c-bfd4-3833b7c74b0d",
      "descriptor": "vssgp.Uy0xLTktMTU1MTM3NDI0NS00Mjc2NDEwNTAwLTExODg5NDc3NzktMjM4Nzc4ODE5MC03MjIwNDQ5MzYtMS0yMTUwMDI1MDkyLTM5NDcwNjYxODEtMzAxMzkxODc1NS0zNjY5MzY3MjUx"
    }
  ]
}
```

#### Examples


### Delete an app in Azure DevOps
```
ado delete -n eCert
```
Output:
```json
{
  "runTime": "15/7/2021 16:22:55 AEST",
  "repo": {
    "type": "repository",
    "name": "eCert",
    "exists": true,
    "status": 200,
    "statusText": "OK",
    "id": "1771c4fb-73af-48af-b3b4-52e0d51431e2",
    "projectName": "Legacy DMZ Playground",
    "webUrl": {
      "href": "https://dev.azure.com/stackcats/Legacy%20DMZ%20Playground/_git/eCert"
    }
  },
  "groups": {
    "allGroups": 10,
    "appGroups": 4,
    "deletedGroups": [
      "eCert Admins",
      "eCert Contributors",
      "eCert Team",
      "eCert Readers"
    ],
    "postDeleteAllGroups": 6,
    "postDeleteAppGroups": 0
  }
}
```
#### Examples


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
