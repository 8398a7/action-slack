import * as core from '@actions/core';
import * as github from '@actions/github';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';

export async function Send(payload: IncomingWebhookSendArguments) {
  core.debug(JSON.stringify(github.context, null, 2));
  const webhook = newWebhook();
  await webhook.send(payload);
  core.debug('send message');
}

export function successPayload(text: string) {
  const payload: IncomingWebhookSendArguments = {
    text: 'Succeeded Workflow',
    attachments: [
      {
        color: 'good',
        author_name: 'action-slack',
        fields: [
          { title: 'repo', value: github.context.repo.repo, short: true },
          { title: 'sha', value: github.context.sha, short: true },
          { title: 'actor', value: github.context.actor, short: true },
          { title: 'eventName', value: github.context.eventName, short: true },
          { title: 'ref', value: github.context.ref, short: true },
          { title: 'workflow', value: github.context.workflow, short: true },
        ],
      },
    ],
  };
  if (text !== '') {
    payload.text = text;
  }
  return payload;
}

export function failurePayload(text: string, mention: string) {
  const payload: IncomingWebhookSendArguments = successPayload(text);
  payload.text = '';
  if (mention !== '') {
    payload.text = `<!${mention}> `;
  }
  payload.text += `Failed Workflow`;

  if (text !== '') {
    payload.text = text;
  }
  if (payload.attachments !== undefined) {
    payload.attachments[0].color = 'danger';
  }
  return payload;
}

function newWebhook() {
  if (process.env.SLACK_WEBHOOK_URL === undefined) {
    throw new Error('Specify SLACK_WEBHOOK_URL');
  }
  const url = process.env.SLACK_WEBHOOK_URL;
  return new IncomingWebhook(url);
}
