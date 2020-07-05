import nock from 'nock';

process.env.GITHUB_WORKFLOW = 'PR Checks';
process.env.GITHUB_SHA = 'b24f03a32e093fe8d55e23cfd0bb314069633b2f';
process.env.GITHUB_REF = 'refs/heads/feature/19';
process.env.GITHUB_EVENT_NAME = 'push';
process.env.GITHUB_TOKEN = 'test-token';
process.env.GITHUB_RUN_ID = '1';
process.env.GITHUB_JOB = 'notification';

import {
  setupNockCommit,
  setupNockJobs,
  successMsg,
  failMsg,
  cancelMsg,
  getTemplate,
  getApiFixture,
} from './helper';
import {
  Client,
  With,
  Success,
  Failure,
  Cancelled,
  Always,
} from '../src/client';

beforeAll(() => {
  nock.disableNetConnect();
  setupNockCommit(process.env.GITHUB_SHA as string);
  setupNockJobs(process.env.GITHUB_RUN_ID as string, 'actions.runs.jobs');
});
afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe('8398a7/action-slack', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = '8398a7/action-slack';
    process.env.GITHUB_EVENT_NAME = 'push';
    const github = require('@actions/github');
    github.context.payload = {};
  });

  describe('fields', () => {
    it('is full fields', async () => {
      const withParams: With = {
        status: '',
        mention: '',
        author_name: '',
        if_mention: '',
        username: '',
        icon_emoji: '',
        icon_url: '',
        channel: '',
        fields:
          'repo,message,commit,author,job,action,eventName,ref,workflow,took',
      };
      const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
      const payload = getTemplate(withParams.fields, successMsg);
      payload.attachments[0].color = 'good';
      expect(await client.success('')).toStrictEqual(payload);
    });
  });

  describe('text is not specified', () => {
    it('is success', async () => {
      const withParams: With = {
        status: '',
        mention: '',
        author_name: '',
        if_mention: '',
        username: '',
        icon_emoji: '',
        icon_url: '',
        channel: '',
        fields: '',
      };
      const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
      const payload = getTemplate(withParams.fields, successMsg);
      payload.attachments[0].color = 'good';
      expect(await client.success('')).toStrictEqual(payload);
    });
    it('is failure', async () => {
      const withParams: With = {
        status: '',
        mention: '',
        author_name: '',
        if_mention: '',
        username: '',
        icon_emoji: '',
        icon_url: '',
        channel: '',
        fields: '',
      };
      const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
      const payload = getTemplate(withParams.fields, failMsg);
      payload.attachments[0].color = 'danger';
      expect(await client.fail('')).toStrictEqual(payload);
    });
    it('is cancel', async () => {
      const withParams: With = {
        status: '',
        mention: '',
        author_name: '',
        if_mention: '',
        username: '',
        icon_emoji: '',
        icon_url: '',
        channel: '',
        fields: '',
      };
      const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
      const payload = getTemplate(withParams.fields, cancelMsg);
      payload.attachments[0].color = 'warning';
      expect(await client.cancel('')).toStrictEqual(payload);
    });
  });

  it('has no mention', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      if_mention: '',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('does not match the requirements of the mention', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Failure,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    let client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    let payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);

    withParams.mention = '';
    client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('matches some of the conditions of the mention', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: `${Failure},${Success}`,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on success', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on failure', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Failure,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on cancelled', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Cancelled,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'warning';
    expect(await client.cancel(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on always', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Always,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    let payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);

    payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);

    payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'warning';
    expect(await client.cancel(msg)).toStrictEqual(payload);
  });

  it('mentions one user', async () => {
    const withParams: With = {
      status: '',
      mention: 'user_id',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<@user_id> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned here', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned channel', async () => {
    const withParams: With = {
      status: '',
      mention: 'channel',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!channel> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('mentions a user group', async () => {
    const withParams: With = {
      status: '',
      mention: 'subteam^user_group_id',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<!subteam^user_group_id> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('mentions multiple user groups', async () => {
    const withParams: With = {
      status: '',
      mention: 'subteam^user_group_id,subteam^user_group_id2',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<!subteam^user_group_id> <!subteam^user_group_id2> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('mentions multiple users', async () => {
    const withParams: With = {
      status: '',
      mention: 'user_id,user_id2',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<@user_id> <@user_id2> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('mentions mix of user and user group', async () => {
    const withParams: With = {
      status: '',
      mention: 'user_id,subteam^user_group_id',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<@user_id> <!subteam^user_group_id> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('removes csv space', async () => {
    const withParams: With = {
      status: '',
      mention: 'user_id, user_id2',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    let client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'hello';

    let payload = getTemplate(
      withParams.fields,
      `<@user_id> <@user_id2> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('returns the expected template', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      if_mention: '',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'hello';

    // for success
    let payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);

    // for cancel
    payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'warning';
    expect(await client.cancel(msg)).toStrictEqual(payload);

    // for fail
    payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('works without GITHUB_TOKEN', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      if_mention: '',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: 'message,author',
    };
    const client = new Client(withParams, undefined, '');
    const payload = getTemplate(withParams.fields, successMsg);
    payload.attachments[0].color = 'good';
    payload.attachments[0].fields = payload.attachments[0].fields.filter(
      (field: any) => !['message', 'author'].includes(field.title),
    );
    expect(await client.success('')).toStrictEqual(payload);
  });

  describe('pull request event', () => {
    beforeEach(() => {
      process.env.GITHUB_EVENT_NAME = 'pull_request';
    });
    afterAll(() => {
      process.env.GITHUB_EVENT_NAME = 'push';
    });

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
        status: '',
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
      expect(await client.success(msg)).toStrictEqual(payload);
    });
  });

  it('throws error', () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      if_mention: '',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    expect(() => new Client(withParams, undefined)).toThrow(
      'Specify secrets.SLACK_WEBHOOK_URL',
    );
  });

  it('send payload', async () => {
    const fn = jest.fn();
    // Mock logs so they don't show up in test logs.
    jest.spyOn(require('@actions/core'), 'debug').mockImplementation(jest.fn());
    const mockSlackWebhookUrl = 'http://example.com';
    nock(mockSlackWebhookUrl)
      .post('/', body => {
        fn();
        expect(body).toStrictEqual({ text: 'payload' });
        return body;
      })
      .reply(200, () => getApiFixture('repos.commits.get'));

    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      if_mention: '',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: '',
    };
    const client = new Client(withParams, undefined, mockSlackWebhookUrl);

    await client.send('payload');

    expect(fn).toBeCalledTimes(1);
  });
  describe('.custom', () => {
    it('is full fields', async () => {
      const withParams: With = {
        status: 'custom',
        mention: '',
        author_name: '',
        if_mention: '',
        username: '',
        icon_emoji: '',
        icon_url: '',
        channel: '',
        fields: 'all',
      };
      const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
      expect(
        await client.custom(`{
          text: \`\${process.env.AS_WORKFLOW}
\${process.env.AS_JOB} (\${process.env.AS_COMMIT}) of \${process.env.AS_REPO}@master by \${process.env.AS_AUTHOR} succeeded in \${process.env.AS_TOOK}\`
          }`),
      ).toStrictEqual({
        text: `<https://github.com/8398a7/action-slack/commit/b24f03a32e093fe8d55e23cfd0bb314069633b2f/checks|PR Checks>
<https://github.com/8398a7/action-slack/runs/762195612|notification> (<https://github.com/8398a7/action-slack/commit/b24f03a32e093fe8d55e23cfd0bb314069633b2f|b24f03a3>) of <https://github.com/8398a7/action-slack|8398a7/action-slack>@master by 839<8398a7@gmail.com> succeeded in 1 hour 1 min 1 sec`,
      });
    });
  });
});
