import * as core from '@actions/core';
import { Send, successPayload, failedPayload } from './slack';
import { MessageAttachment } from '@slack/types';

async function run() {
  try {
    switch (core.getInput('type')) {
      case 'auto':
        throw new Error('not implement');
        break;
      case 'success':
        await Send(successPayload());
        break;
      case 'failed':
        await Send(failedPayload());
        break;
      default:
        const text = core.getInput('text');
        const attachments: Array<MessageAttachment> = JSON.parse(
          core.getInput('attachments'),
        );
        await Send({
          text,
          attachments,
        });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
