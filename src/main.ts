import * as core from '@actions/core';
import { Send, successPayload, failedPayload } from './slack';
import { IncomingWebhookSendArguments } from '@slack/webhook';

async function run() {
  try {
    let payload: IncomingWebhookSendArguments = {};
    switch (core.getInput('type')) {
      case 'auto':
        throw new Error('not implement');
      case 'success':
        payload = successPayload();
        break;
      case 'failed':
        payload = failedPayload();
        break;
      default:
        payload = JSON.parse(core.getInput('payload'));
    }
    await Send(payload);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
