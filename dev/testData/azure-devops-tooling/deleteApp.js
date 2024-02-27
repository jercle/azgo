const fs = require('fs');

const getProject = require('./funcs/getProject');
const getRepo = require('./funcs/getRepo');
const getProjectDescriptors = require('./funcs/getProjectDescriptors');
const deleteRepo = require('./funcs/deleteRepo');
const deleteAllProjectGroups = require('./funcs/deleteAllProjectGroups');

async function deleteApp(config) {
  const project = await getProject(config);

  const currentdate = new Date();
  const datetime = `${currentdate.getDate()}/${
    currentdate.getMonth() + 1
  }/${currentdate.getFullYear()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()} AEST`;

  !project.exists && // Ensuires project exists before continuing
    (() => {
      console.error(`ERROR: The project ${config.project} does not exist`);
      process.exit();
    })();

  const projectScopeDescriptor = await getProjectDescriptors(
    config,
    project.id
  );

  const repo = await getRepo(config);

  repo.exists // Ensures repo exists before continuing
    ? await deleteRepo(config, repo.id)
    : (() => {
        console.error(`ERROR: A repo named "${repo.name}" was not found`);
        return `ERROR: A repo named "${repo.name}" was not found`;
      })();

  const groups = await deleteAllProjectGroups(config, projectScopeDescriptor);

  // postDeleteAllGroups: checkProjectGroups.value.length,
  // postDeleteAppGroups: checkAppGroups.length,

  // const checkRepo = await getRepo(config);
  // const fullDelete = !checkRepo.exists && !checkTeam.exists ? true : false;

  // console.log({
  //   checkTeamExistsPostRun: checkTeam.exists,
  //   checkRepoExistsPostRun: checkRepo.exists,
  //   fullDelete,
  // });

  // const fullSuccess
  const log = {
    runTime: datetime,
    // team,
    // teamCheck,
    // deleted,
    repo, // done
    // branch,
    // policy,
    groups, // done
    // fullDelete,
  };
  console.log(log);

  // Output log file with data from above 'log' vairable
  fs.writeFileSync(
    `./logs/delete-${config.appName}-${Date.now()}.json`,
    JSON.stringify(log, null, 2)
  );
}

module.exports = deleteApp;
