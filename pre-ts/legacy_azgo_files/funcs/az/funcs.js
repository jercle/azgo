// hljs.highlightAll();

// Data Aggregator
$(document).ready(function () {
  let uniqueApplicationsCsv = []
  let data = ""
  const reader = new FileReader()

  function formatBytes(bytes, decimals) {
    if (bytes == 0) return "0 Bytes"
    var k = 1024,
      dm = decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  $("#toggler").on("click", () => {
    $("#loadingfile").toggleClass("d-none")
  })

  $("#file-input").on("change", () => {
    $("#loadingfile").toggleClass("d-none", false)
    const file = document.querySelector("#file-input").files[0]

    reader.readAsText(file)
    reader.addEventListener("load", function (e) {
      $("#loadingfile").toggleClass("d-none", true)
      $(".uniqueApps").toggleClass("d-none", false)
      $("#file-details").text(`
          File Name: ${file.name}
          File Size: ${formatBytes(file.size)}
          `)
      const text = e.target.result.toString().split("\n").slice(1)
      const dataArray = text
        .map((item) => item.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/))
        .filter((i) => i.length > 2)
      const uniqueApplications = [
        ...new Set(
          text
            .map((item) => item.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)[2])
            .filter((i) => i != null)
        ),
      ]
      uniqueApplicationsArray = uniqueApplications
        .map((item) => item.replaceAll(",", "").replaceAll('"', ""))
        .sort()
      uniqueApplicationsCsv = uniqueApplicationsArray.join("\r\n")
      // console.log(text)
      console.log(dataArray)

      const aggregatedData = dataArray.map((item) => {
        let data = item[0].split("\\\\").join().split(",")
        // console.log(data)

        const obj = {
          domain: data[0],
          username: data[1],
          machineId: item[1],
          application: item[2],
          totalTimeSecons: item[3],
          timeActive: item[4],
        }
        return obj
      })
      // console.log(aggregatedData)

      $("#appDatatable").DataTable({
        data: aggregatedData,
        columns: [
          { data: "domain" },
          { data: "username" },
          { data: "machineId" },
          { data: "application" },
        ],
      })
    })
  })

  $(".uniqueApps").attr(
    "title",
    "CSV Columns: user, machine, displayname, totaltimeseconds, timeactive"
  )
  $("#uniqueApps-save").on("click", () =>
    window.open("data:text/csv;charset=utf-8," + uniqueApplicationsCsv)
  )
  $("#uniqueApps-copy").on("click", () =>
    navigator.clipboard.writeText(uniqueApplicationsCsv)
  )
  $("#testPaste").on("click", async () => {
    data = await navigator.clipboard.readText()
    console.log(data)
    $(".uniqueApps").toggleClass("d-none", false)
  })

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  )
  // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})
// END Data Aggregator

// Spreadsheet to Markdown/HTML
$(document).ready(function () {
  let tableOutputToggleValue = true

  $("#outputToggle").change((e) => {
    const text = $("#markdownTable").val()
    tableOutputToggleValue = e.target.checked
    // console.log(tableOutputToggleValue)
    // $('#styleToggle').toggleClass('d-none', tableOutputToggleValue)
    $("#tablestyle").prop("disabled", tableOutputToggleValue)

    if (tableOutputToggleValue) {
      // console.log(text)
      const tableMarkdown = convertToMarkdown(text)
      $("#renderedTableHtml").toggleClass("d-none", tableOutputToggleValue)
      $("#renderedTableHtml").html("")
      $("#convertedTable").val(tableMarkdown)
    } else {
      // console.log(text)
      $("#renderedTableHtml").toggleClass("d-none", tableOutputToggleValue)
      const wb = XLSX.read(text, { type: "string" })
      const ws = wb.Sheets.Sheet1
      // const tableHtml = XLSX.utils.sheet_to_html(ws, { header: '', footer: '' })
      const tableHtml = XLSX.utils.sheet_to_html(ws, { header: "", footer: "" })
      // let outputHtml = $('#tablestyle').is(':checked') ? XLSX.utils.sheet_to_html(ws, { header: '', footer: '' }).replace('<table>', '<table class="table table-striped table-bordered"') : XLSX.utils.sheet_to_html(ws, { header: '', footer: '' })
      // const outputHtml = tableHtml.replace('<table>', '<table class="table table-striped table-bordered"')
      navigator.clipboard.writeText(tableHtml)
      $("#convertedTable").val(tableHtml)
      $("#renderedTableHtml").html(
        tableHtml
      )
    }
  })

  $("#copyTable").on("click", () => {
    const text = $("#markdownTable").val()
    // console.log(tableOutputToggleValue)
    event.preventDefault()
    if (tableOutputToggleValue) {
      const tableMarkdown = convertToMarkdown(text)
      navigator.clipboard.writeText(tableMarkdown)
      $("#convertedTable").val(tableMarkdown)
      // console.log(tableMarkdown)
    } else {
      const wb = XLSX.read(text, { type: "string" })
      const ws = wb.Sheets.Sheet1
      const tableHtml = XLSX.utils.sheet_to_html(ws, { header: "", footer: "" })
      navigator.clipboard.writeText(tableHtml)
      $("#convertedTable").val(tableHtml)
      $("#renderedTableHtml").html(
        tableHtml
      )
      // console.log(tableHtml)
    }
  })

  function columnWidth(rows, columnIndex) {
    return Math.max.apply(
      null,
      rows.map(function (row) {
        return row[columnIndex].length
      })
    )
  }

  function convertToMarkdown(text) {
    let data = text.replace(/(?:[\n\u0085\u2028\u2029]|\r\n?)$/, "")

    let rows = data.split(/[\n\u0085\u2028\u2029]|\r\n?/g).map(function (row) {
      // console.log(row)
      return row.split("\t")
    })

    let colAlignments = []

    let columnWidths = rows[0].map(function (column, columnIndex) {
      let alignment = "l"
      let re = /^(\^[lcr])/i
      let m = column.match(re)
      if (m) {
        let align = m[1][1].toLowerCase()
        if (align === "c") {
          alignment = "c"
        } else if (align === "r") {
          alignment = "r"
        }
      }
      colAlignments.push(alignment)
      column = column.replace(re, "")
      rows[0][columnIndex] = column
      return columnWidth(rows, columnIndex)
    })

    let markdownRows = rows.map(function (row, rowIndex) {
      return (
        "| " +
        row
          .map(function (column, index) {
            return (
              column + Array(columnWidths[index] - column.length + 1).join(" ")
            )
          })
          .join(" | ") +
        " |"
      )
    })

    markdownRows.splice(
      1,
      0,
      "|" +
        columnWidths
          .map(function (width, index) {
            let prefix = ""
            let postfix = ""
            let adjust = 0
            let alignment = colAlignments[index]
            if (alignment === "r") {
              postfix = ":"
              adjust = 1
            } else if (alignment == "c") {
              prefix = ":"
              postfix = ":"
              adjust = 2
            }
            return (
              prefix +
              Array(columnWidths[index] + 3 - adjust).join("-") +
              postfix
            )
          })
          .join("|") +
        "|"
    )

    return markdownRows.join("\n")
  }
})
// END Spreadsheet to Markdown/HTML

var CsvToHtmlTable = CsvToHtmlTable || {}

CsvToHtmlTable = {
  init: function (options) {
    options = options || {}
    var csv_path = options.csv_path || ""
    var el = options.element || "table-container"
    var allow_download = options.allow_download || false
    var csv_options = options.csv_options || {}
    var datatables_options = options.datatables_options || {}
    var custom_formatting = options.custom_formatting || []
    var customTemplates = {}
    $.each(custom_formatting, function (i, v) {
      var colIdx = v[0]
      var func = v[1]
      customTemplates[colIdx] = func
    })

    var $table = $(
      "<table class='table table-striped table-condensed' id='" +
        el +
        "-table'></table>"
    )
    var $containerElement = $("#" + el)
    $containerElement.empty().append($table)

    $.when($.get(csv_path)).then(function (data) {
      var csvData = $.csv.toArrays(data, csv_options)
      var $tableHead = $("<thead></thead>")
      var csvHeaderRow = csvData[0]
      var $tableHeadRow = $("<tr></tr>")
      for (var headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) {
        $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx]))
      }
      $tableHead.append($tableHeadRow)

      $table.append($tableHead)
      var $tableBody = $("<tbody></tbody>")

      for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
        var $tableBodyRow = $("<tr></tr>")
        for (var colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
          var $tableBodyRowTd = $("<td></td>")
          var cellTemplateFunc = customTemplates[colIdx]
          if (cellTemplateFunc) {
            $tableBodyRowTd.html(cellTemplateFunc(csvData[rowIdx][colIdx]))
          } else {
            $tableBodyRowTd.text(csvData[rowIdx][colIdx])
          }
          $tableBodyRow.append($tableBodyRowTd)
          $tableBody.append($tableBodyRow)
        }
      }
      $table.append($tableBody)

      $table.DataTable(datatables_options)

      if (allow_download) {
        $containerElement.append(
          "<p><a class='btn btn-info' href='" +
            csv_path +
            "'><i class='glyphicon glyphicon-download'></i> Download as CSV</a></p>"
        )
      }
    })
  },
}
