import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'

import path from 'path'

import cliProgress from "cli-progress"
import { exit } from 'process'

const dataPath = "./fakedata/nsgLogs"

function formatValue(v, options, type) {
  function autopadding(value, length) {
    return (options.autopaddingChar + value).slice(-length)
  }
  switch (type) {
    case 'percentage':
      return autopadding(v, 3)
    case 'total':
      return (v + 1).toLocaleString('en-US')
    case 'value':
      return (v + 1).toLocaleString('en-US')
    default:
      return v
  }
}


/**
 * Find all files inside a dir, recursively.
 * @function listAllFiles
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
export const listAllFiles = dir =>
  readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = statSync(name).isDirectory();
    return isDirectory ? [...files, ...listAllFiles(name)] : [...files, name];
  }, []);


export const combineFlowLogs = () => {
  const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      stopOnComplete: true,
      hideCursor: true,
      format: ' {bar} | {percentage}% {value}/{total}  | Duration: {duration_formatted}',
      formatValue
    },
    cliProgress.Presets.shades_grey
  )


  const allFileNames = listAllFiles(dataPath)


  const combineFilesProgress = multibar.create(allFileNames.length - 1, 0, { filename: `Combining and transforming dataset` })
  let allSourceIps = []
  let allDestIps = []


  for (let i = 0; i < allFileNames.length; i++) {

    if (i % 3 == 0) {
      combineFilesProgress.update(i)
      // progressBar.update(index)
      multibar.update()
    }

    const fileData = JSON.parse(readFileSync(allFileNames[i])).records
    // console.log(fileData)
    // process.exit(0)

    for (const fileLog of fileData) {
      // console.log(fileLog)
      let sourceIps = []
      let destIps = []

      const flows = fileLog.properties.flows
      // const flowTuples = fileLog.properties.flows.length



      for (const flow of flows) {

        for (const tuple of flow.flows[0].flowTuples) {
          const splitTuple = tuple.split(',')
          sourceIps.push(splitTuple[1])
          destIps.push(splitTuple[2])

        }
      }
      allSourceIps.push(...sourceIps)
      allDestIps.push(...destIps)
      // allSourceIps = [...allSourceIps, ...sourceIps]
      // allDestIps = [...allDestIps, ...destIps]
    }

    allSourceIps = [...new Set([...allSourceIps])]
    allDestIps = [...new Set([...allDestIps])]

  }


  multibar.stop()


  writeFileSync("sourceIps.csv", allSourceIps.join("\n"))
  writeFileSync("allDestIps.csv", allDestIps.join("\n"))

}


// combineFlowLogs()

export const getMinMaxRecordsLengths = (dataPath) => {
  const logfiles = listAllFiles(dataPath)
  // console.log(logfiles.length)
  // exit()

  let minSize = 0
  let maxSize = 0
  let flowsMinSize = 0
  let flowsMaxSize = 0
  let logFileRecordCount = 0

  for (const logfile of logfiles) {
    // console.log(logfile.records.length)
    const logfileData = JSON.parse(readFileSync(logfile))
    // console.log(logfileData.records.length)
    const recordsLength = logfileData.records.length

    if (minSize === 0) {
      minSize = recordsLength
    }

    if (recordsLength < minSize) {
      minSize = recordsLength
    }

    if (recordsLength > maxSize) {
      maxSize = recordsLength
    }

    for (const record of logfileData.records) {
      const flows = record.properties.flows
      if (flowsMinSize === 0) {
        flowsMinSize = flows.length
      }

      if (flows.length < flowsMinSize) {
        flowsMinSize = flows.length
      }

      if (flows.length > flowsMaxSize) {
        flowsMaxSize = flows.length
      }
    }
    logFileRecordCount += logfileData.records.length


  }

  console.log({
    minSize,
    maxSize,
    flowsMinSize,
    flowsMaxSize,
    logFileRecordCount
  })
}

getMinMaxRecordsLengths(dataPath)
