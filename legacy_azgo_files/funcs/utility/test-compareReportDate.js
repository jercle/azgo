const moment = require("moment")

function compareReportDate(reportDate) {
  return moment().diff(moment(reportDate), "days")
}

// compareReportDate("2022-06-20T18:09:13+10:00")


module.exports = compareReportDate
