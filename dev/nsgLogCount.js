import { readFileSync } from "fs";

import { listAllFiles } from "./combineNsgFlowLogs.js";

// const jsonData = JSON.parse(readFileSync("../testData/nsgLogs.json"))

// console.log(jsonData.length)
const dataPath = "./fakedata/nsgLogs"
const allFileNames = listAllFiles(dataPath)

console.log(allFileNames.length)
