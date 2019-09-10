import * as core from '@actions/core';
import * as github from '@actions/github';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';

interface With {
  mention: '' | 'channel' | 'here';
  author_name: string;
  only_mention_fail: '' | 'channel' | 'here';
}

export class Client {
  private webhook: IncomingWebhook;
  private github: github.GitHub;
  private with: With;

  constructor(props: With) {
    this.with = props;

    if (process.env.GITHUB_TOKEN === undefined) {
      throw new Error('Specify secrets.GITHUB_TOKEN');
    }
    this.github = new github.GitHub(process.env.GITHUB_TOKEN as string);

    if (process.env.SLACK_WEBHOOK_URL === undefined) {
      throw new Error('Specify secrets.SLACK_WEBHOOK_URL');
    }
    const url = process.env.SLACK_WEBHOOK_URL;
    this.webhook = new IncomingWebhook(url);
  }

  public async success(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'good';
    template.text += 'Succeeded Github Actions\n';
    template.text += text;

    this.send(template);
  }

  public async fail(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'danger';
    if (this.with.only_mention_fail !== '') {
      template.text += `<!${this.with.only_mention_fail}> `;
    }
    template.text += 'Failed Github Actions\n';
    template.text += text;

    this.send(template);
  }

  public async cancel(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'warning';
    template.text += 'Cancelded Github Actions\n';
    template.text += text;

    this.send(template);
  }

  public async send(payload: string | IncomingWebhookSendArguments) {
    core.debug(JSON.stringify(github.context, null, 2));
    await this.webhook.send(payload);
    core.debug('send message');
  }

  private async payloadTemplate() {
    const { sha } = github.context;
    const { owner, repo } = github.context.repo;
    const commit = await this.github.repos.getCommit({ owner, repo, ref: sha });
    const { author } = commit.data.commit;

    let text = '';
    if (this.with.mention !== '') {
      text += `<!${this.with.mention}> `;
    }

    return {
      text: text,
      attachments: [
        {
          color: '',
          author_name: this.with.author_name,
          fields: [
            { title: 'repo', value: repo, short: true },
            {
              title: 'message',
              value: commit.data.commit.message,
              short: true,
            },
            {
              title: 'commit',
              value: `<https://github.com/${owner}/${repo}/commit/${sha}|${sha}>`,
              short: true,
            },
            {
              title: 'action',
              value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks|action>`,
              short: true,
            },
            {
              title: 'author',
              value: `${author.name}<${author.email}>`,
              short: true,
            },
            {
              title: 'eventName',
              value: github.context.eventName,
              short: true,
            },
            { title: 'ref', value: github.context.ref, short: true },
            { title: 'workflow', value: github.context.workflow, short: true },
          ],
        },
      ],
    };
  }
}
