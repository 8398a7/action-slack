import * as core from '@actions/core';

async function run() {
  try {
    const text = core.getInput('text');
    const iconEmoji = core.getInput('iconEmoji');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
