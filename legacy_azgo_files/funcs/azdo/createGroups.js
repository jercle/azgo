const axios = require('axios').default;

/**
 * Creates multiple project scoped groups
 *
 * @param {Object} config - Object including appName, organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @param {object} params - Object used to create group (projectScopeDescriptor, displayName, description)
 * @param {string} params.projectScopeDescriptor - Scope descriptor for Project in order to scope this group to project
 * @param {string} params.displayName - Display name of group
 * @param {string} params.description - Discription of group
 * @returns {Array} Array of Objects containing description, displayName, principalName, id, descriptor of each created group
 */

async function createGroups(
  { appName, organization, pat },
  projectScopeDescriptor
) {
  let groups = [
    {
      displayName: `${appName} Admins`,
      description: `Admin group for ${appName}`,
    },
    {
      displayName: `${appName} Readers`,
      description: `Read Only group for ${appName}`,
    },
    {
      displayName: `${appName} Contributors`,
      description: `Contributor group for ${appName}`,
    },
  ];

  try {
    let createdGroups = [];

    for (group in groups) {
      let g = await axios({
        method: 'POST',
        url: `https://vssps.dev.azure.com/${organization}/_apis/graph/groups?scopeDescriptor=${projectScopeDescriptor}&api-version=6.0-preview.1`,
        auth: {
          username: '',
          password: pat,
        },
        data: {
          displayName: groups[group].displayName,
          description: groups[group].description,
        },
      });
      g = g.data;
      const createdGroup = {
        description: g.description,
        displayName: g.displayName,
        principalName: g.principalName,
        id: g.originId,
        descriptor: g.descriptor,
      };
      createdGroups.push(createdGroup);
    }

    return createdGroups;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = createGroups;
