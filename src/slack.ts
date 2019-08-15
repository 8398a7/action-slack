import * as core from '@actions/core';
import { IncomingWebhook } from '@slack/webhook';

export interface Payload {
  text: string;
  icon_emoji: string;
}

export async function Send(payload: Payload) {
  const webhook = newWebhook();
  await webhook.send(payload);
  core.debug('send message');
}

function newWebhook() {
  if (process.env.SLACK_WEBHOOK_URL === undefined) {
    throw new Error('Specify SLACK_WEBHOOK_URL');
  }
  const url = process.env.SLACK_WEBHOOK_URL;
  return new IncomingWebhook(url);
}
