import * as core from '@actions/core';
import * as github from '@actions/github';
import Octokit from '@octokit/rest';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';

interface With {
  status: string;
  mention: '' | 'channel' | 'here';
  author_name: string;
  only_mention_fail: '' | 'channel' | 'here';
  username: string;
  icon_emoji: string;
  icon_url: string;
  channel: string;
  exclude_fields: string[]
}

export class Client {
  private github?: github.GitHub;
  private with: With;
  private webhook: IncomingWebhook;

  constructor(props: With, github?: github.GitHub) {
    this.with = props;
    this.github = github;

    if (process.env.SLACK_WEBHOOK_URL === undefined) {
      throw new Error('Specify secrets.SLACK_WEBHOOK_URL');
    }
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  }

  public async success(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'good';
    template.text += `:heavy_check_mark: Successful GitHub Action ${this.actionLink}\n`;
    template.text += text;

    this.send(template);
  }

  public async fail(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'danger';
    if (this.with.only_mention_fail !== '') {
      template.text += `<!${this.with.only_mention_fail}> `;
    }
    template.text += `:no_entry: Failed GitHub Action ${this.actionLink}\n`;
    template.text += text;

    this.send(template);
  }

  public async cancel(text: string) {
    const template = await this.payloadTemplate();
    template.attachments[0].color = 'warning';
    template.text += `:warning: Canceled Github Action ${this.actionLink}\n`;
    template.text += text;

    this.send(template);
  }

  public async send(payload: string | IncomingWebhookSendArguments) {
    core.debug(JSON.stringify(github.context, null, 2));
    const toSend = JSON.stringify(payload, null, 2);
    console.log('Sending message: ' + toSend);
    
    await this.webhook.send(payload);
  }

  private get actionLink() {
    const { sha } = github.context;
    const { owner, repo } = github.context.repo;
    return `<https://github.com/${owner}/${repo}/commit/${sha}/checks|${github.context.workflow}>`;
  }

  private async payloadTemplate() {
    if (this.github === undefined) {
      throw Error('Specify secrets.GITHUB_TOKEN');
    }

    let text = '';
    if (this.with.mention !== '') {
      text += `<!${this.with.mention}> `;
    }

    const { sha } = github.context;
    const { owner, repo } = github.context.repo;
    const commit = await this.github.repos.getCommit({ owner, repo, ref: sha });
    const { author } = commit.data.commit;

    return {
      text: text,
      icon_emoji: this.with.icon_emoji,
      icon_url: this.with.icon_url,
      username: this.with.username,
      attachments: [
        {
          color: '',
          author_name: this.with.author_name !== '__COMMITTER__' ? this.with.author_name : `${author.name}<${author.email}>`,
          channel: this.with.channel,
          fields: await this.fields(commit),
        },
      ],
    };
  }

  private fields(commit: Octokit.Response<Octokit.ReposGetCommitResponse>) {
    if (this.github === undefined) {
      throw Error('Specify secrets.GITHUB_TOKEN');
    }
    const { author } = commit.data.commit;

    return [
      {
        title: 'message',
        value: commit.data.commit.message,
        short: false,
      },
      this.repo,
      this.commit,
      {
        title: 'author',
        value: `${author.name}<${author.email}>`,
        short: true,
      },
      this.action,
      this.eventName,
      this.ref,
      this.workflow,
    ].filter(v => !this.with.exclude_fields.includes(v.title));
  }

  private get commit() {
    const { sha } = github.context;
    const { owner, repo } = github.context.repo;

    return {
      title: 'commit',
      value: `<https://github.com/${owner}/${repo}/commit/${sha}|${sha.substring(0,6)}...>`,
      short: true,
    };
  }

  private get repo() {
    const { owner, repo } = github.context.repo;

    return {
      title: 'repo',
      value: `<https://github.com/${owner}/${repo}|${owner}/${repo}>`,
      short: true,
    };
  }

  private get action() {
    const { sha } = github.context;
    const { owner, repo } = github.context.repo;

    return {
      title: 'action',
      value: this.actionLink,
      short: true,
    };
  }

  private get eventName() {
    return {
      title: 'eventName',
      value: github.context.eventName,
      short: true,
    };
  }

  private get ref() {
    return { title: 'ref', value: github.context.ref, short: true };
  }

  private get workflow() {
    return { title: 'workflow', value: github.context.workflow, short: true };
  }
}
