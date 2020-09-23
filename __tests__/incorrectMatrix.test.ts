import nock from 'nock';

process.env.GITHUB_RUN_ID = '2';
process.env.MATRIX_CONTEXT = '{}';

import { newWith, setupNockCommit, setupNockJobs, successMsg } from './helper';
import { Client, With, Success } from '../src/client';

beforeAll(() => {
  nock.disableNetConnect();
  setupNockCommit(process.env.GITHUB_SHA as string);
  setupNockJobs(
    process.env.GITHUB_RUN_ID as string,
    'actions.matrix-runs.jobs',
  );
});
afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe('MATRIX_CONTEXT', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = '8398a7/action-slack';
    process.env.GITHUB_EVENT_NAME = 'push';
    const github = require('@actions/github');
    github.context.payload = {};
  });

  it('not runs in matrix', async () => {
    const withParams = {
      ...newWith(),
      status: Success,
      fields: 'job,took',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    expect(await client.prepare('')).toStrictEqual({
      text: successMsg,
      attachments: [
        {
          author_name: '',
          color: 'good',
          fields: [
            {
              short: true,
              title: 'job',
              value:
                'Job is not found.\nCheck <https://action-slack.netlify.app/fields|the matrix> or <https://action-slack.netlify.app/with#job_name|job name>.',
            },
            {
              short: true,
              title: 'took',
              value:
                'Job is not found.\nCheck <https://action-slack.netlify.app/fields|the matrix> or <https://action-slack.netlify.app/with#job_name|job name>.',
            },
          ],
        },
      ],
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    });
  });
});
