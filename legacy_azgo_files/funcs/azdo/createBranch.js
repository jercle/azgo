const axios = require('axios').default;

/**
 * Creates a branch in provided Repository
 *
 * @param {Object} config Object including appName, organization, project, pat
 * @param {string} config.organization Name of the organization in Azure DevOps
 * @param {string} config.pat Personal Access Token from Azure DevOps
 * @param {string} config.appName Name of Team - Used for repository name
 * @param {string} config.defaultBranch Name of branch
 * @returns {Object} type, status, statusText, id, sshUrl, WebUrl
 */

async function createBranch({
  organization,
  project,
  appName,
  pat,
  defaultBranch,
}) {
  const branch = 'main';
  try {
    const res = await axios({
      method: 'POST',
      url: `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${appName}/pushes?api-version=5.1`,
      data: {
        refUpdates: [
          {
            name: `refs/heads/${defaultBranch}`,
            oldObjectId: '0000000000000000000000000000000000000000',
          },
        ],
        commits: [
          {
            comment: 'Initial commit.',
            changes: [
              {
                changeType: 'add',
                item: {
                  path: '/readme.md',
                },
                newContent: {
                  content: `#${appName}`,
                  contentType: 'rawtext',
                },
              },
            ],
          },
        ],
      },
      auth: {
        username: '',
        password: pat,
      },
    });

    const response = {
      type: 'branch',
      name: res.data.refUpdates[0].name,
      status: res.status,
      statusText: res.statusText,
      repoId: res.data.refUpdates[0].repositoryId,
      commitId: res.data.commits[0].commitId,
      commitWebUrl: `https://dev.azure.com/stackcats/blank/_git/a/commit/${res.data.commits[0].commitId}`,
      repoWebUrl: `https://dev.azure.com/${organization}/${project}/_git/${appName}`,
    };

    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = createBranch;
