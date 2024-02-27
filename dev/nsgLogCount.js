import { readFileSync } from "fs";

const jsonData = JSON.parse(readFileSync("../testData/nsgLogs.json"))

console.log(jsonData.length)
