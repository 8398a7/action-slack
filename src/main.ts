import * as core from '@actions/core';
import { Client, Success, Failure, Cancelled, Custom } from './client';
import { IncomingWebhookSendArguments } from '@slack/webhook';

async function run(): Promise<void> {
  try {
    const status = core.getInput('status', { required: true }).toLowerCase();
    const mention = core.getInput('mention');
    const author_name = core.getInput('author_name');
    const if_mention = core.getInput('if_mention').toLowerCase();
    const text = core.getInput('text');
    const username = core.getInput('username');
    const icon_emoji = core.getInput('icon_emoji');
    const icon_url = core.getInput('icon_url');
    const channel = core.getInput('channel');
    const rawPayload = core.getInput('payload');

    core.debug(`status: ${status}`);
    core.debug(`mention: ${mention}`);
    core.debug(`author_name: ${author_name}`);
    core.debug(`if_mention: ${if_mention}`);
    core.debug(`text: ${text}`);
    core.debug(`username: ${username}`);
    core.debug(`icon_emoji: ${icon_emoji}`);
    core.debug(`icon_url: ${icon_url}`);
    core.debug(`channel: ${channel}`);
    core.debug(`rawPayload: ${rawPayload}`);

    const client = new Client(
      {
        status,
        mention,
        author_name,
        if_mention,
        username,
        icon_emoji,
        icon_url,
        channel,
      },
      process.env.GITHUB_TOKEN,
      process.env.SLACK_WEBHOOK_URL,
    );

    switch (status) {
      case Success:
        await client.send(await client.success(text));
        break;
      case Failure:
        await client.send(await client.fail(text));
        break;
      case Cancelled:
        await client.send(await client.cancel(text));
        break;
      case Custom:
        /* eslint-disable no-var */
        var payload: IncomingWebhookSendArguments = eval(
          `payload = ${rawPayload}`,
        );
        /* eslint-enable */
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
