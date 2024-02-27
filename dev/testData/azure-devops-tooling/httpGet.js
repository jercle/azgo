const axios = require('axios').default;

/**
 * Description:
 *
 * @param {Object} config - Configuration object including appName, organization, project, pat
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @return
 */
async function httpGet({ pat }, url) {
  url = url.split(' ').length > 1 ? url.split(' ')[1] : url;
  try {
    const response = await axios({
      method: 'GET',
      url: `${url}`,
      auth: {
        username: '',
        password: pat,
      },
    });

    console.log(response.data);
    // return response.data
  } catch (err) {
    console.error(err);
  }
}

module.exports = httpGet;
