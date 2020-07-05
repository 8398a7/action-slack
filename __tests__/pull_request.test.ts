import nock from 'nock';

process.env.GITHUB_REPOSITORY = '8398a7/action-slack';
process.env.GITHUB_WORKFLOW = 'PR Checks';
process.env.GITHUB_SHA = 'b24f03a32e093fe8d55e23cfd0bb314069633b2f';
process.env.GITHUB_REF = 'refs/heads/feature/19';
process.env.GITHUB_EVENT_NAME = 'pull_request';
process.env.GITHUB_TOKEN = 'test-token';
process.env.GITHUB_RUN_ID = '1';
process.env.GITHUB_JOB = 'notification';

import { setupNockCommit, getTemplate } from './helper';
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

    const withParams: With = {
      status: Success,
      mention: 'user_id',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: 'action',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<@user_id> ${msg}`, sha);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });
});
