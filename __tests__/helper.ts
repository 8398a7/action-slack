import nock from 'nock';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Field, With } from '../src/client';
import { FieldFactory } from '../src/fields';
import github, { context, getOctokit } from '@actions/github';

export const gitHubToken = 'github-token';
export const gitHubBaseUrl = '';
export const webhookUrl = 'https://hooks.slack.com/services/xxx';

export const getTemplate: any = (
  fields: string,
  text: string,
  sha?: string,
) => {
  return {
    text,
    attachments: [
      {
        author_name: '',
        color: '',
        fields: fixedFields(fields, sha),
      },
    ],
    username: '',
    icon_emoji: '',
    icon_url: '',
    channel: '',
  };
};

export const setupNockCommit = (sha: string) =>
  nock('https://api.github.com')
    .persist()
    .get(`/repos/8398a7/action-slack/commits/${sha}`)
    .reply(200, () => getApiFixture('repos.commits.get'));

export const setupNockJobs = (runId: string, fixture: string) =>
  nock('https://api.github.com')
    .persist()
    .get(`/repos/8398a7/action-slack/actions/runs/${runId}/jobs`)
    .reply(200, () => {
      const obj = getApiFixture(fixture);
      const now = new Date();
      now.setHours(now.getHours() - 1);
      now.setMinutes(now.getMinutes() - 1);
      now.setSeconds(now.getSeconds() - 1);
      obj.jobs[0].started_at = now.toISOString();
      return obj;
    });

export const successMsg = ':white_check_mark: Succeeded GitHub Actions\n';
export const cancelMsg = ':warning: Canceled GitHub Actions\n';
export const failMsg = ':no_entry: Failed GitHub Actions\n';
export const getApiFixture = (name: string): any =>
  JSON.parse(
    readFileSync(resolve(__dirname, 'fixtures', `${name}.json`)).toString(),
  );

export const newWith = (): With => {
  return {
    status: '',
    mention: '',
    author_name: '',
    if_mention: '',
    username: '',
    icon_emoji: '',
    icon_url: '',
    channel: '',
    fields: '',
    job_name: '',
  };
};

export const fixedFields = (fields: string, sha?: string) => {
  const ff = new FieldFactory(
    fields,
    process.env.GITHUB_JOB as string,
    '',
    getOctokit(gitHubToken),
  );
  return ff.filterField(
    [
      ff.includes('repo') ? repo() : undefined,
      ff.includes('message') ? message() : undefined,
      ff.includes('commit') ? commit() : undefined,
      ff.includes('author') ? author() : undefined,
      ff.includes('action') ? action(sha) : undefined,
      ff.includes('job') ? job() : undefined,
      ff.includes('took') ? took() : undefined,
      ff.includes('eventName') ? eventName() : undefined,
      ff.includes('ref') ? ref() : undefined,
      ff.includes('workflow') ? workflow(sha) : undefined,
      ff.includes('pullRequest') ? pullRequest() : undefined,
    ],
    undefined,
  );
};

export const repo = (): Field => {
  return {
    short: true,
    title: 'repo',
    value: '<https://github.com/8398a7/action-slack|8398a7/action-slack>',
  };
};

export const message = (): Field => {
  const obj: any = getApiFixture('repos.commits.get');
  return {
    short: true,
    title: 'message',
    value: `<${obj.html_url}|[#19] support for multiple user mentions &amp; escaping &lt;, &gt;>`,
  };
};

export const commit = (): Field => {
  return {
    short: true,
    title: 'commit',
    value: `<https://github.com/8398a7/action-slack/commit/${
      process.env.GITHUB_SHA
    }|${process.env.GITHUB_SHA?.slice(0, 8)}>`,
  };
};

export const author = (): Field => {
  return { short: true, title: 'author', value: '839<8398a7@gmail.com>' };
};

export const eventName = (): Field => {
  return {
    short: true,
    title: 'eventName',
    value: process.env.GITHUB_EVENT_NAME as string,
  };
};

export const ref = (): Field => {
  return { short: true, title: 'ref', value: process.env.GITHUB_REF as string };
};

export const workflow = (sha?: string): Field => {
  return {
    short: true,
    title: 'workflow',
    value: `<https://github.com/8398a7/action-slack/commit/${
      sha ?? process.env.GITHUB_SHA
    }/checks|${process.env.GITHUB_WORKFLOW as string}>`,
  };
};

export const action = (sha?: string): Field => {
  return {
    short: true,
    title: 'action',
    value: `<https://github.com/8398a7/action-slack/commit/${
      sha ?? process.env.GITHUB_SHA
    }/checks|action>`,
  };
};

export const job = (): Field => {
  return {
    short: true,
    title: 'job',
    value: `<https://github.com/8398a7/action-slack/runs/762195612|${process.env.GITHUB_JOB}>`,
  };
};

export const took = (): Field => {
  return {
    short: true,
    title: 'took',
    value: '1 hour 1 min 1 sec',
  };
};

export const pullRequest = (): Field => {
  let value;
  if (context.eventName.startsWith('pull_request')) {
    value =
      '<https://github.com/8398a7/action-slack/pull/123|Add pullRequest field &amp; escaping &lt;, &gt; #123>';
  } else {
    value = 'n/a';
  }
  return {
    short: true,
    title: 'pullRequest',
    value: value,
  };
};
