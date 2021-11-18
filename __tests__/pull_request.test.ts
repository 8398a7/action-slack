import nock from 'nock';

process.env.GITHUB_EVENT_NAME = 'pull_request';

import {
  setupNockCommit,
  getTemplate,
  newWith,
  gitHubToken,
  gitHubBaseUrl,
  webhookUrl,
} from './helper';
import { Client, Success } from '../src/client';
import github from '@actions/github';

beforeAll(() => {
  nock.disableNetConnect();
  setupNockCommit(process.env.GITHUB_SHA as string);
});
afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe('pull request event', () => {
  it('works on pull request event', async () => {
    const github = require('@actions/github');
    const sha = 'expected-sha-for-pull_request_event';
    github.context.payload = {
      pull_request: {
        number: 123,
        head: { sha },
      },
    };
    github.context.eventName = 'pull_request';

    const withParams = {
      ...newWith(),
      status: Success,
      mention: 'user_id',
      if_mention: Success,
      fields: 'action',
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<@user_id> ${msg}`, sha);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });
});

describe.each`
  eventName
  ${`pull_request`}
  ${`pull_request_review`}
  ${`pull_request_review_comment`}
  ${`pull_request_target`}
`('pullRequest field on pull_request events', ({ eventName }) => {
  test(`${eventName}`, async () => {
    const github = require('@actions/github');
    const sha = 'expected-sha-for-pull_request_event';
    github.context.payload = {
      pull_request: {
        html_url: 'https://github.com/8398a7/action-slack/pull/123',
        title: 'Add pullRequest field & escaping <, >',
        number: 123,
        head: { sha },
      },
    };
    github.context.eventName = eventName;

    const withParams = {
      ...newWith(),
      status: Success,
      fields: 'pullRequest',
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'pullRequest test';
    const payload = getTemplate(withParams.fields, msg, sha);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
    expect(process.env.AS_PULL_REQUEST).toStrictEqual(
      '<https://github.com/8398a7/action-slack/pull/123|Add pullRequest field &amp; escaping &lt;, &gt; #123>',
    );
  });
});
