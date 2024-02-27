import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'

import path from 'path'

import cliProgress from "cli-progress"

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

/**
 * Find all files inside a dir, recursively.
 * @function getAllFiles
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
const getAllFiles = dir =>
  readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);
    const isDirectory = statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);

const allFileNames = getAllFiles(dataPath)



const combineFilesProgress = multibar.create(allFileNames.length - 1, 0, { filename: `Combining and transforming dataset` })
let allSourceIps = []
let allDestIps = []


for (let i = 0; i < allFileNames.length; i++) {

  if (i % 3 == 0) {
    combineFilesProgress.update(i)
    // progressBar.update(index)
    multibar.update()
  }

  const fileData = JSON.parse(readFileSync(allFileNames[i]))
  // console.log(fileData)
  // process.exit(0)

  for (const fileLog of fileData) {
    // console.log(fileLog)
    const sourceIps = []
    const destIps = []

    const flows = fileLog.properties.flows
    // const flowTuples = fileLog.properties.flows.length



    for (const flow of flows) {

      for (const tuple of flow.flows[0].flowTuples) {
        const splitTuple = tuple.split(',')
        sourceIps.push(splitTuple[1])
        destIps.push(splitTuple[2])

      }
    }
    allSourceIps = [...allSourceIps, ...sourceIps]
    allDestIps = [...allDestIps, ...destIps]
  }

  allSourceIps = [...new Set([...allSourceIps])]
  allDestIps = [...new Set([...allDestIps])]

}


multibar.stop()


writeFileSync("sourceIps.csv", allSourceIps.join("\n"))
writeFileSync("allDestIps.csv", allDestIps.join("\n"))
