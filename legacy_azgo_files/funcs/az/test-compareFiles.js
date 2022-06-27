const { readFileSync } = require("fs")

const mainRpm = readFileSync("../testData/mainrpm.txt")
  .toString()
  .toLowerCase()
  .split(/\r?\n/)
  .filter((file) => file !== "" && file.slice(-1) != "/")
const mainZip = readFileSync("../testData/mainzip.txt")
  .toString()
  .toLowerCase()
  .split(/\r?\n/)
  .filter((file) => file !== "" && file.slice(-1) != "/")
const sdkRpm = readFileSync("../testData/sdkrpm.txt")
  .toString()
  .toLowerCase()
  .split(/\r?\n/)
  .filter((file) => file !== "" && file.slice(-1) != "/")
const sdkZip = readFileSync("../testData/sdkzip.txt")
  .toString()
  .toLowerCase()
  .split(/\r?\n/)
  .filter((file) => file !== "" && file.slice(-1) != "/")

// console.log(mainRpm)
// console.log(mainZip)
// console.log(sdkRpm)
// console.log(sdkZip)

let mainCompared = mainZip.reduce((all, item, index) => {
  // console.log(item)

  let result = mainRpm.find((file) => {
    if (file.includes(item)) {
      // console.log(`${item} - ${file}`)
      return true
    }
  })
  let path = !result ? "" : result

  const splitPath = path
    .split("/")
    .filter((i) => i != "")
    // .slice(0, -1)
    .join("/")

  return { ...all, [item]: { exists: !!result, path: splitPath } }
}, {})

// console.log(mainCompared)

let sdkCompared = sdkZip.reduce((all, item, index) => {
  // console.log(item.split("/").length)
  // console.log(item)
  const match =
    item.split("/").filter((str) => str.length > 0).length > 1
      ? item.split("/").at(-1)
      : item
  // console.log(match)
  // console.log(item.split("/"))
  let result = sdkRpm.find((file) => {
    if (file.includes(match)) {
      // console.log(`${match} - ${file}`)
      return true
    }
  })
  let path = !result ? "" : result
  const splitPath = path
    .split("/")
    .filter((i) => i != "")
    // .slice(0, -1)
    .join("/")
  return { ...all, [item]: { exists: !!result, path: splitPath } }
}, {})

console.log(sdkCompared)
