const axios = require('axios').default;

async function getPolicy({ organization, project, pat }) {
  try {
    const data = await axios({
      method: 'GET',
      url: `https://dev.azure.com/${organization}/${project}/_apis/policy/configurations?api-version=6.1-preview.1`,
      auth: {
        username: '',
        password: pat,
      },
    });
    console.log(data.data.count);
    // console.log(data.data.value[0].settings)
    // console.log(data.data.value[0].type)

    // data.data.value.forEach(val => console.log(val.settings))
    // data.data.value.forEach(val => console.log(val.type))

    // return res
  } catch (err) {
    console.error(err);
    // const res = {
    //     type: "project",
    //     name: project,
    //     exists: false,
    //     status: err.response.status,
    //     statusText: err.response.statusText,
    //     message: err.response.data.message,
    // }

    // // console.log(res)
    // return res
  }
}

module.exports = getPolicy;
