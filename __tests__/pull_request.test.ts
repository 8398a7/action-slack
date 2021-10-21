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

  it('pull request information in pullRequest field', async () => {
    const github = require('@actions/github');
    const sha = 'expected-sha-for-pull_request_event';
    github.context.payload = {
      pull_request: {
        html_url: 'https://github.com/8398a7/action-slack/pull/123',
        title: 'Add pullRequest field',
        number: 123,
        head: { sha },
      },
    };
    github.context.eventName = 'pull_request';

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
  });
});
