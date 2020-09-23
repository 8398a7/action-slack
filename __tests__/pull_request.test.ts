import nock from 'nock';

process.env.GITHUB_EVENT_NAME = 'pull_request';

import { setupNockCommit, getTemplate, newWith } from './helper';
import { Client, With, Success } from '../src/client';

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
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<@user_id> ${msg}`, sha);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });
});
