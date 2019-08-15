import * as core from '@actions/core';
import { Send } from './slack';

async function run() {
  try {
    const text = core.getInput('text');
    const iconEmoji = core.getInput('iconEmoji');
    await Send({
      text: text,
      icon_emoji: iconEmoji,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
