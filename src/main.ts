import * as core from '@actions/core';
import { Client, Success, Failure, Cancelled, Custom } from './client';

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
    const custom_payload = core.getInput('custom_payload');
    const payload = core.getInput('payload');
    const fields = core.getInput('fields');
    const job_name = core.getInput('job_name');
    const github_token = core.getInput('github_token');
    const github_base_url = core.getInput('github_base_url');

    core.debug(`status: ${status}`);
    core.debug(`mention: ${mention}`);
    core.debug(`author_name: ${author_name}`);
    core.debug(`if_mention: ${if_mention}`);
    core.debug(`text: ${text}`);
    core.debug(`username: ${username}`);
    core.debug(`icon_emoji: ${icon_emoji}`);
    core.debug(`icon_url: ${icon_url}`);
    core.debug(`channel: ${channel}`);
    core.debug(`custom_payload: ${custom_payload}`);
    core.debug(`payload: ${payload}`);
    core.debug(`fields: ${fields}`);
    core.debug(`job_name: ${job_name}`);
    core.debug(`github_base_url: ${github_base_url}`);

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
        fields,
        job_name,
      },
      github_token,
      github_base_url,
      process.env.SLACK_WEBHOOK_URL,
    );

    switch (status) {
      case Success:
      case Failure:
      case Cancelled:
        await client.send(await client.prepare(text));
        break;
      case Custom:
        await client.send(await client.custom(custom_payload));
        break;
      default:
        throw new Error(
          'You can specify success or failure or cancelled or custom',
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
