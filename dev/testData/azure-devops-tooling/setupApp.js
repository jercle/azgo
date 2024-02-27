const fs = require('fs');

const createGroups = require('./funcs/createGroups');
const createTeam = require('./funcs/createTeam');
const createRepo = require('./funcs/createRepo');
const createBranch = require('./funcs/createBranch');
const setBranchPolicy = require('./funcs/setBranchPolicy');
const getProject = require('./funcs/getProject');
const getTeam = require('./funcs/getTeam');
const getRepo = require('./funcs/getRepo');
const getProjectDescriptors = require('./funcs/getProjectDescriptors');

async function setupApp(config) {
  const currentdate = new Date();
  const datetime = `Last Sync: ${currentdate.getDate()}/${
    currentdate.getMonth() + 1
  }/${currentdate.getFullYear()}@${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;

  const project = await getProject(config);
  const projectScopeDescriptor = await getProjectDescriptors(
    config,
    project.id
  );
  const team = await getTeam(config);
  const repo = await getRepo(config);

  if (!project.exists) {
    // Ensuires project exists before continuing
    console.error(`ERROR: The project ${config.project} does not exist`);
    process.exit();
  }

  if (team.exists || repo.exists) {
    // Ensures team and repository does not already exist
    team.exists &&
      console.error(`ERROR: A team named "${team.name}" already exists`);
    repo.exists &&
      console.error(`ERROR: A repository named "${repo.name}" already exists`);
    process.exit();
  } else {
    // Code runs when project DOES exist and team and repository BOTH DO NOT exist
    console.log('All checks passed, creating team and repository');
    const team = await createTeam(config);
    const repo = await createRepo(config);
    const groups = await createGroups(config, projectScopeDescriptor);
    const branch = await createBranch(config);
    const policy = await setBranchPolicy(config, repo.id);

    const log = {
      runTime: datetime,
      team,
      repo,
      branch,
      policy,
      groups,
    };

    console.log(log);

    // Output log file with data from above 'log' vairable
    fs.writeFileSync(
      `./logs/create-${config.appName}-${Date.now()}.json`,
      JSON.stringify(log, null, 2)
    );
  }
}

module.exports = setupApp;
