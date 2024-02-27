$(function () {
  let data = JSON.parse($("#jsonData").html())
  console.log(data)

  $("#scanDesc").text(`${data.length} vulnerabilities found in Java packages`)
  $("#numVulns").append(`${data.length} Total Vulnerabilities Found`)

  data.forEach((vuln) => {
    $("#vulnerabilities").append(`
  <tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">${vuln.VulnerabilityID}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${vuln.PkgName}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${vuln.PkgPath}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${vuln.InstalledVersion}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${vuln.FixedVersion}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">View</a>
                  </td>
  </tr>
      `)
  })
  $("#jsonData").html("")
})
// for (const result of data) {
// }
// $("#techOpsIncs").append(`
// <tr id=${data[0].VulnerabilityID}>
// <td>
// <button class="btn btn-success btn-xs incId">${data[0].VulnerabilityID}</button>
// </td>
// </tr>
// `)

{
  /* <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Lindsay Walton</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Front-end Developer</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">lindsay.walton@example.com</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Member</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay Walton</span></a>
                </td> */
}

// <tr id=${vuln.VulnerabilityID}>
// <td>
// <button class="btn btn-success btn-xs incId">${vuln.VulnerabilityID}</button>
// </td>
// </tr>
