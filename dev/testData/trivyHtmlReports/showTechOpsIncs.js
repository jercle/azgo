var showTechOpsIncs = function() {
  fetch('http://mintl3.integrate.atotnet.gov.au:3033/api/incidents/resolver/ESMC_InsightPortalSupport,ESMC_Technical_Ops,ESMC_InsightPortal_Owners,EUTS_Technical_Support') // Call the fetch function passing the url of the API as a parameter
    .then(function(rsp) {
      return rsp.json();
    })
    .then(function(data) {
      // console.log(data)
      $('#techOpsIncs').html('');
      $('#numIncs').text(` - ${data.length}`);

      for (var i = 0; i < data.length; i++) {
        var status = '';
        if (data[i].Status == 1) {
          status = 'Assigned';
        } else if (data[i].Status == 2) {
          status = 'In Progress';
        } else if (data[i].Status == 3) {
          status = 'Pending';
        }

        if (!data[i].Assignee) {
          data[i].Assignee = `<em>${data[i].Assigned_Group}</em>`;
        } else {
          var height = 125;

          data[i].Assignee = `<img src="/avatars/${data[
            i
          ].Assignee_Login_ID.toUpperCase()}.jpg" height="${height}" onerror="this.style.display = 'none'"><br /> ${
            data[i].Assignee
          }`;
          data[i].Corporate_ID = `<img src="/avatars/${data[
            i
          ].Corporate_ID.toUpperCase().trim()}.jpg" height="${
            data[i].Corporate_ID.toLowerCase().trim() == 'eoc' ? '75' : height
          }" onerror="this.style.display = 'none'"><br /> ${data[
            i
          ].Corporate_ID.trim()}`;
        }
        if (!data[i].Detailed_Decription) {
          data[i].Detailed_Decription = `<em>N/A</em>`;
        }

        $('#techOpsIncs').append(`
      <tr id=${data[i].Incident_Number}>
      <td>
      <span class="smallfont"><a href="http://insightitsm.atonet.gov.au/arsys/forms/syd02h747pvn/HPD%3AHelp+Desk+Classic/Default+User+View/?qual=%271000000161%27%3D%22${
        data[i].Incident_Number
      }%22" target="_blank">${data[i].Incident_Number}</a></span><br />
      <button class="btn btn-success btn-xs incId">View</button>
      </td>

      <td>
      <div class="time"><span class="smallfont">${data[i].First_Name} ${data[i].Last_Name} (${data[i].Corporate_ID})</span>
      </div>
      </td>

      <td class="description">
      <div class="desc">${data[i].Description}
        <span class="detdesc">${data[i].Detailed_Decription.replace(
          /\n/g,
          '<br />'
        )}</span>
      </div>
      </td>

      <td>
      <div class="time"><span class="smallfont">${moment(
        data[i].Submit_Date * 1000
      ).format('DD/MM/YYYY <br> HH:mm:ss')}</span>
        <span class="fromnow">${moment(
          data[i].Submit_Date * 1000
        ).fromNow()}</span>
      </div>
      </td>

      <td>
      <div class="time"><span class="smallfont">${data[i].Assignee} (${data[i].Assignee_Login_ID})</span>
        <span class="fromnow">${data[i].Assigned_Group}</span>
      </div>
      </td>

      <td>
      <span class="smallfont">${status}</span>
      </td>


      <td>
      <div class="time"><span class="smallfont">${moment(
        data[i].Last_Modified_Date * 1000
      ).format('DD/MM/YYYY <br> HH:mm:ss')}</span>
        <span class="fromnow">${moment(
          data[i].Last_Modified_Date * 1000
        ).fromNow()}</span>
      </div>
      </td>
      </tr>
      `);
      }
      $('.incId').on('click', function() {
        showIncident(this.parentElement.parentElement.id);
      });
    });
};

showTechOpsIncs();

setInterval(showTechOpsIncs, 5 * 60 * 1000);
