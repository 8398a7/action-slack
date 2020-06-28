import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import { FieldFactory } from './fields';

export const Success = 'success';
type SuccessType = 'success';
export const Failure = 'failure';
type FailureType = 'failure';
export const Cancelled = 'cancelled';
type CancelledType = 'cancelled';
export const Custom = 'custom';
export const Always = 'always';
type AlwaysType = 'always';

export type GitHub = InstanceType<typeof GitHub>;

export interface With {
  status: string;
  mention: string;
  author_name: string;
  if_mention: string;
  username: string;
  icon_emoji: string;
  icon_url: string;
  channel: string;
  fields: string;
}

export interface Field {
  title: string;
  value: string;
  short: boolean;
}

const groupMention = ['here', 'channel'];
const subteamMention = 'subteam^';

export class Client {
  private fieldFactory: FieldFactory;
  private webhook: IncomingWebhook;
  private github?: GitHub;
  private with: With;

  constructor(props: With, token?: string, webhookUrl?: string) {
    this.with = props;
    if (this.with.fields === '') this.with.fields = 'repo,commit';

    if (token !== undefined) {
      this.github = getOctokit(token);
    }

    if (webhookUrl === undefined) {
      throw new Error('Specify secrets.SLACK_WEBHOOK_URL');
    }
    this.webhook = new IncomingWebhook(webhookUrl);
    this.fieldFactory = new FieldFactory(this.with.fields, this.github);
  }

  async success(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'good';
    template.text += this.mentionText(this.with.mention, Success);
    template.text += this.insertText(
      ':white_check_mark: Succeeded GitHub Actions\n',
      text,
    );

    return template;
  }

  async fail(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'danger';
    template.text += this.mentionText(this.with.mention, Failure);
    template.text += this.insertText(
      ':no_entry: Failed GitHub Actions\n',
      text,
    );

    return template;
  }

  async cancel(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'warning';
    template.text += this.mentionText(this.with.mention, Cancelled);
    template.text += this.insertText(
      ':warning: Canceled GitHub Actions\n',
      text,
    );

    return template;
  }

  async custom(payload: string) {
    await this.fieldFactory.attachments();
    /* eslint-disable no-var */
    var template: IncomingWebhookSendArguments = eval(`template = ${payload}`);
    /* eslint-enable */
    return template;
  }

  async send(payload: string | IncomingWebhookSendArguments) {
    core.debug(JSON.stringify(context, null, 2));
    await this.webhook.send(payload);
    core.debug('send message');
  }

  private async payloadTemplate() {
    const text = '';
    const { username, icon_emoji, icon_url, channel } = this.with;

    return {
      text,
      username,
      icon_emoji,
      icon_url,
      channel,
      attachments: [
        {
          color: '',
          author_name: this.with.author_name,
          fields: await this.fieldFactory.attachments(),
        },
      ],
    };
  }

  private getIdString(id: string): string {
    if (id.includes(subteamMention)) return `<!${id}>`;
    else return `<@${id}>`;
  }

  private mentionText(
    mention: string,
    status: SuccessType | FailureType | CancelledType | AlwaysType,
  ) {
    if (
      !this.with.if_mention.includes(status) &&
      this.with.if_mention !== Always
    ) {
      return '';
    }

    const normalized = mention.replace(/ /g, '');
    if (groupMention.includes(normalized)) {
      return `<!${normalized}> `;
    } else if (normalized !== '') {
      const text = normalized
        .split(',')
        .map(id => this.getIdString(id))
        .join(' ');
      return `${text} `;
    }
    return '';
  }

  private insertText(defaultText: string, text: string) {
    return text === '' ? defaultText : text;
  }
}
