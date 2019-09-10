import * as core from '@actions/core';
import { Client } from './client';
import { IncomingWebhookSendArguments } from '@slack/webhook';

async function run() {
  try {
    let status: string = core.getInput('status', { required: true });
    status = status.toLowerCase();
    const mention = core.getInput('mention') as '' | 'channel' | 'here';
    const author_name = core.getInput('author_name');
    const only_mention_fail = core.getInput('only_mention_fail') as
      | ''
      | 'channel'
      | 'here';
    const text = core.getInput('text');
    core.debug(`text: ${text}`);
    core.debug(`mention: ${mention}`);
    core.debug(`status: ${status}`);
    const client = new Client({
      mention,
      author_name,
      only_mention_fail,
    });

    switch (status) {
      case 'success':
        await client.success(text);
        break;
      case 'failure':
        await client.fail(text);
        break;
      case 'cancelled':
        await client.cancel(text);
        break;
      case 'custom':
        const payload: IncomingWebhookSendArguments = JSON.parse(
          core.getInput('payload'),
        );
        await client.send(payload);
        break;
      default:
        throw new Error(
          'You can specify success or failure or cancelled or custom',
        );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
