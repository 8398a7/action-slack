import * as core from '@actions/core';
import { Send } from './slack';
import { MessageAttachment } from '@slack/types';

async function run() {
  try {
    const text = core.getInput('text');
    const attachments: Array<MessageAttachment> = JSON.parse(
      core.getInput('attachments'),
    );
    await Send({
      text,
      attachments,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
