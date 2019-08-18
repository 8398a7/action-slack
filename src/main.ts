import * as core from '@actions/core';
import { Send, successPayload, failurePayload } from './slack';
import { IncomingWebhookSendArguments } from '@slack/webhook';

async function run() {
  try {
    let payload: IncomingWebhookSendArguments = {};
    const text = core.getInput('text');
    const failedMention = core.getInput('failedMenthon');
    const _type = core.getInput('type');
    core.debug(`text: ${text}`);
    core.debug(`failedMention: ${failedMention}`);
    core.debug(`type: ${_type}`);

    switch (_type) {
      case 'auto':
        throw new Error('not implement');
      case 'success':
        payload = successPayload(text);
        break;
      case 'failure':
        payload = failurePayload(text, failedMention);
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
