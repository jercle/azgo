const readlineSync = require('readline-sync');

const deleteGroup = require('./deleteGroup');
const getProjectGroups = require('./getProjectGroups');

/**
 * Deletes all groups for provided project Id
 *
 * @param {Object} config - Configuration object including appName, organization, project, pat
 * @param {string} config.organization - Name of the organization in Azure DevOps
 * @param {string} config.pat - Personal Access Token from Azure DevOps
 * @return {Object} Object containing data on groups deleted, if any
 */

async function deleteAllProjectGroups(config, projectScopeDescriptor) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const projectGroups = await getProjectGroups(config, projectScopeDescriptor);

  // Filter array to only include groups related to App
  // Note - filter will find all groups with App's name in displayName property
  const appGroups = projectGroups.value.filter((group) =>
    group.displayName.includes(config.appName)
  );

  appGroups.forEach((group) => console.log(group.displayName));

  let confirmGroups = false;
  if (appGroups.length > 0) {
    // Prompts user to confirm displayed groups should be deleted
    confirmGroups = readlineSync.keyInYN(
      `Confirm deletion of above ${appGroups.length} groups?`
    );
  }

  let checkAppGroups, checkProjectGroups;

  if (confirmGroups) {
    appGroups.forEach(async (group) => {
      await deleteGroup(config, group.descriptor);
    });

    console.log('Checking group deletions');
    await delay(1000);

    checkProjectGroups = await getProjectGroups(config, projectScopeDescriptor);

    // Filter to check the App's groups have been deleted
    checkAppGroups = checkProjectGroups.value.filter((group) => {
      return group.displayName.includes(config.appName);
    });
  }

  const deletedGroups = confirmGroups
    ? appGroups.map((group) => group.displayName)
    : 'Group deletion cancelled or no groups to delete';

  const groups = {
    allGroups: projectGroups.value.length,
    appGroups: appGroups.length,
    deletedGroups,
  };

  if (appGroups.length > 0 && confirmGroups) {
    groups.postDeleteAllGroups = checkProjectGroups.value.length;
    groups.postDeleteAppGroups = checkAppGroups.length;
  }

  return groups;
}

module.exports = deleteAllProjectGroups;
