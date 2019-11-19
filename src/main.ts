import * as core from '@actions/core';
import { Client } from './client';
import { IncomingWebhookSendArguments } from '@slack/webhook';
import * as github from '@actions/github';

async function run() {
  try {
    let s: string = core.getInput('status') || 'default';
    let status = s.toLowerCase() as 
      'success' 
      | 'failure'
      | 'cancelled'
      | 'custom';

    const mention = core.getInput('mention') as '' | 'channel' | 'here';

    const author_name = core.getInput('author_name');
    
    const only_mention_fail = core.getInput('only_mention_fail') as
      | ''
      | 'channel'
      | 'here';

    const text = core.getInput('text');
    const username = core.getInput('username');
    const icon_emoji = core.getInput('icon_emoji');
    const icon_url = core.getInput('icon_url');
    const channel = core.getInput('channel');
    const exclude_fields = core.getInput('exclude_fields').split(/[, ]+/);
    const rawPayload = core.getInput('payload');

    core.debug(`status: ${status}`);
    core.debug(`mention: ${mention}`);
    core.debug(`author_name: ${author_name}`);
    core.debug(`only_mention_fail: ${only_mention_fail}`);
    core.debug(`text: ${text}`);
    core.debug(`username: ${username}`);
    core.debug(`icon_emoji: ${icon_emoji}`);
    core.debug(`icon_url: ${icon_url}`);
    core.debug(`channel: ${channel}`);
    core.debug(`rawPayload: ${rawPayload}`);
    core.debug('Exclude fields: ' + JSON.stringify(exclude_fields));

    var gh: github.GitHub | undefined = undefined;
    if (status !== 'custom') {
      if (process.env.GITHUB_TOKEN === undefined) {
        throw new Error('Specify secrets.GITHUB_TOKEN');
      }
      gh = new github.GitHub(process.env.GITHUB_TOKEN);
    }

    const client = new Client({
      status,
      mention,
      author_name,
      only_mention_fail,
      username,
      icon_emoji,
      icon_url,
      channel,
      exclude_fields
    }, gh);

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
        var payload: IncomingWebhookSendArguments = eval(
          `payload = ${rawPayload}`,
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
