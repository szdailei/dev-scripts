/* eslint-disable no-console */
/* eslint-disable camelcase */
import fs from 'fs';
import shell from 'shelljs';
import { Octokit } from '@octokit/rest';
import releaseInfo from './release-info.js';
import { updateGitIndex, addTagToLocalRepo, pushToRemoteRepo } from './update-repo.js';

const mainBranch = 'main';
const devBranch = 'dev';

function removeTheFirstLineOfReleaseNote(origRelaseNote) {
  let releaseNote = '';
  const lines = origRelaseNote.split('\n');
  for (let i = 1; i < lines.length; i += 1) {
    releaseNote += `${lines[i]}\n`;
  }
  return releaseNote;
}

function isMajorOrMinorRelease(version) {
  const fields = version.split('.');
  if (fields[2].trim() === '0') return true;
  return false;
}

function switchToGitBranch(branch) {
  if (shell.exec(`git switch ${branch}`).code === 0) return;
  console.log(`Error: Failure switch to ${branch} branch`);
  process.exit(1);
}

function pushToMainBranch() {
  const res = shell.exec(`git push`)
  console.log("res",res)
  console.log(`Error: Failure push to main branch`);
  process.exit(1);
}

async function toGitHub() {
  const { repo, owner, version, tag_name, name, releaseNotefileName } = await releaseInfo();

  if (isMajorOrMinorRelease(version)) {
    switchToGitBranch(mainBranch);
    pushToMainBranch()

    process.exit(1);
    console.log('Error: There is uncommitted changes, please "git add . && git-cz" before publish');
    process.exit(1);
  }
  console.log('is');
  process.exit(1);

  try {
    fs.statSync(releaseNotefileName);
  } catch (error) {
    console.log(`Error: ${releaseNotefileName} not found. You MUST generate and check it before publish`);
    process.exit(1);
  }

  const origReleaseNote = fs.readFileSync(releaseNotefileName, 'utf-8');
  const releaseNote = removeTheFirstLineOfReleaseNote(origReleaseNote);

  let octokit;
  try {
    const token = process.env.GITHUB_TOKEN.trim();
    octokit = new Octokit({ auth: token });
  } catch (error) {
    console.log(`Error: GITHUB_TOKEN not set or wrong. You MUST export GITHUB_TOKEN to environment`);
    process.exit(1);
  }

  if (updateGitIndex().code !== 0) {
    console.log('Error: There is uncommitted changes, please "git add . && git-cz" before publish');
    process.exit(1);
  }

  if (isMajorOrMinorRelease(version)) {
    process.exit(1);
    console.log('Error: There is uncommitted changes, please "git add . && git-cz" before publish');
    process.exit(1);
  }
  process.exit(1);

  addTagToLocalRepo(version);
  pushToRemoteRepo();

  try {
    await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name,
      name,
      body: releaseNote,
    });
    console.log(`${name} published to github`);
  } catch (err) {
    console.log('err', err.toString());
  }
}

export default toGitHub;
