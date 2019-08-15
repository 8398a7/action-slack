import * as core from '@actions/core';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';

export async function Send(payload: IncomingWebhookSendArguments) {
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
