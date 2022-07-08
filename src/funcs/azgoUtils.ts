// TODO: Filter array from array of conditions.

import { arch, platform } from 'os'

import chalk from 'chalk'
import { MongoClient } from "mongodb";
import commandExists from 'command-exists'

import { checkCache } from './azgoCaching.js'

import {
  transformVulnerabilityData,
  groupByAttribute,
  getAllUniqueCves,
  countByAttribute
} from './azureVulnarabilityAggregation.js'


// const repos = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getAllContainerRepositories.json").toString().trim()).repositories
// console.log(repos[5])
// const data = JSON.parse(readFileSync("/Users/jercle/git/azgo/testData/20220616/getsubAssessments.json").toString().trim()).data
// console.log(data)


// vulnerabilityFilter(transformVulnerabilityData(data, repos), ["os:windows", "patchable:false", "severity:medium"])


export function printWorkItems(workItemArray: any[]) {
  workItemArray.map(wi => {
    for (const key in wi) {
      if (wi.hasOwnProperty(key)) {
        const element = wi[key];
        element && console.log(chalk.blue(`${key}: ${chalk.reset(element)}`))
      }
    }
    console.log()
  })
}

export function formatWorkItems(workItemArray: any[]) {
  return workItemArray.map(workItem => ({
    id: workItem.id,
    title: workItem.fields['System.Title'],
    state: workItem.fields['System.State'],
    areaPath: workItem.fields['System.AreaPath'],
    iterationPath: workItem.fields['System.IterationPath'].split('\\').slice(1).join('\\'),
    type: workItem.fields['System.WorkItemType'],
    assigneeName: workItem.fields['System.AssignedTo'].displayName,
    assigneeEmail: workItem.fields['System.AssignedTo'].uniqueName,
    created: workItem.fields['System.CreatedDate'],
    updated: workItem.fields['System.ChangedDate'],
    htmlLink: workItem["_links"].html.href,
    descrption: stripHtml(workItem.fields['System.Description']),
    latestComment: stripHtml(workItem.fields["System.History"])
  }))
}

export function stripHtml(str: string): string {
  return str && str.replace(/<[^>]*>/g, '').replace('&nbsp;', '') || ''
}

export async function showDebug(opts, config) {
  // console.log(config)
  // console.log(opts)
  const { cacheDir, subscriptionCacheFiles } = await checkCache(opts, null, config, 'checkOnly')
  // Console logging twice for troubleshooting and piping out.
  const result = {
    cache: {
      cacheDir,
      subscriptionCacheFiles,
      opts
    }
  }
  // This prints json to stdout, which can be piped out to a file
  console.log(JSON.stringify(result, null, 2))

  // This prints to stderr, which does not pipe. But is coloured and parsed by
  // the terminal for readability
  console.error({
    cacheDir,
    subscriptionCacheFiles,
    opts
  })
  // console.debug(opts)
  // 'azgo subs --debug > file.json' would only write the first output to the file

  console.error(`Assessments cache exists: ${!!subscriptionCacheFiles['assessments.json'] ?
    chalk.yellow(!!subscriptionCacheFiles['assessments.json']) :
    chalk.redBright(!!subscriptionCacheFiles['assessments.json'])}`)
  console.error(`Repositories cache exists: ${!!subscriptionCacheFiles['repositories.json'] ?
    chalk.yellow(!!subscriptionCacheFiles['repositories.json']) :
    chalk.redBright(!!subscriptionCacheFiles['repositories.json'])}`)
  console.error(`containerRegistries cache exists: ${!!subscriptionCacheFiles['containerRegistries.json'] ?
    chalk.yellow(!!subscriptionCacheFiles['containerRegistries.json']) :
    chalk.redBright(!!subscriptionCacheFiles['containerRegistries.json'])}`)
  process.exit()
}

// console.log(`Last synced ${formatDistance(parseISO(data.azgoSyncDate), new Date(), { addSuffix: true })}`)

// check if cache exists
// check if resyncData option is selected
// fetch new data appropriately
// return requested data




export function vulnerabilityFilter(data, filter) {
  const filters = filter.reduce((all, item, index) => {
    let [attr, val] = item.split(':')
    if (!all[attr]) {
      all[attr] = []
    }
    all[attr] = val.split(',').map(v => {
      if (v.toLowerCase() === 'true') {
        return true
      } else if (v.toLowerCase() === 'false') {
        return false
      } else {
        return v.toLowerCase()
      }
    })
    return all
  }, {})

  const filterKeys = Object.keys(filters);
  const filtered = data.filter(function (eachObj) {
    return filterKeys.every(function (eachKey) {
      if (!filters[eachKey].length) {
        return true;
      }
      return filters[eachKey].includes(eachObj[eachKey]);
    });
  });
  // console.log(filtered)
  return filtered
}


export async function uploadToMongoDatabase(data, { dbConnectionString }) {
  const client = new MongoClient(dbConnectionString);
  try {
    console.log(`Uploading ${chalk.yellow(data.length)} vulnerabilities to database`)

    await client.connect();
    const database = client.db("client-dawe-azgo-db")
    const vulns = database.collection("client-dawe-azgo-vulnerabilities")

    let bulk = vulns.initializeUnorderedBulkOp()
    data.forEach(async (vuln) => {

      await bulk.find({ _id: vuln._id }).upsert().replaceOne(vuln)
    })
    const bulkExecution = await bulk.execute()
    console.log(bulkExecution)

  } catch (err) {
    console.log(err)

  } finally {

    await client.close();
  }
}

// getTrivyDownload()
export async function getTrivyDownload() {
  const data = await (await fetch('https://api.github.com/repos/aquasecurity/trivy/releases/latest')).json()
  // console.log(data)
  const plat = platform() === 'darwin' ? 'macos' : platform()
  const architecture = arch() === 'amd64' ? '64bit' : arch()
  const filter = [plat, architecture]
  // console.log(filter)
  // only show browser_download_url attributes
  const download = data.assets.filter(item => filter.every(f => item.browser_download_url.toLowerCase().includes(f)))
  // const download = data.assets.filter(item => item.browser_download_url.toLowerCase().includes(filter))
  const url = download.map(i => `${i.browser_download_url}\n`)

  if (plat === 'macos') {
    console.log(`${chalk.bold(chalk.underline('There are multiple ways in which you can install trivy'))}
${chalk.underline('1. Homebrew:')}
${chalk.dim('brew install aquasecurity/trivy/trivy')}
${chalk.underline("2. Using AquaSec's install script:")}
${chalk.dim('curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.18.3')}
${chalk.underline('3. Download the appropriate binary and add it to your path:')}
${chalk.dim(url.join('').trim())}
3. Or build from source - see https://aquasecurity.github.io/trivy/v0.18.3/installation/ for more information`)
  } else {
    console.log(`${chalk.bold(chalk.underline('There are multiple ways in which you can install trivy'))}
  ${chalk.underline("1. Using AquaSec's install script:")}
  ${chalk.dim('curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.18.3')}
  ${chalk.underline('2. Download the appropriate binary and add it to your path:')}
  ${chalk.dim(url.length > 0 ? url.join('').trim() : 'https://api.github.com/repos/aquasecurity/trivy/releases/latest')}
3. Or build from source - see https://aquasecurity.github.io/trivy/v0.18.3/installation/ for more information`)
  }
}
// const exists = commandExists.sync('trivy')
// console.log(exists)

// https://aquasecurity.github.io/trivy/v0.18.3/installation/#install-script
// curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.18.3
// arch:
// 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', and 'x64'
// platform:
// 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'.
