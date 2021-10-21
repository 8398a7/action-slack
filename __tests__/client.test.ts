import nock from 'nock';
import {
  setupNockCommit,
  setupNockJobs,
  successMsg,
  failMsg,
  cancelMsg,
  getTemplate,
  getApiFixture,
  newWith,
  gitHubToken,
  gitHubBaseUrl,
  webhookUrl,
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
    process.env.https_proxy = 'http://localhost:1334';
    process.env.HTTPS_PROXY = 'http://localhost:1334';
    const github = require('@actions/github');
    github.context.payload = {};
  });

  describe('incoming webhook url', () => {
    it('is returns an exception because the environment variable does not exist', () => {
      const withParams = newWith();
      expect(() => {
        new Client(
          withParams,
          gitHubToken,
          gitHubBaseUrl,
          process.env.NOT_FOUND_ENV,
        );
      }).toThrow();
    });
    it('is returns exception because null value', () => {
      const withParams = newWith();
      expect(() => {
        new Client(withParams, gitHubToken, gitHubBaseUrl, null);
      }).toThrow();
    });
    it('is returns exception because undefined value', () => {
      const withParams = newWith();
      expect(() => {
        new Client(withParams, gitHubToken, gitHubBaseUrl, undefined);
      }).toThrow();
    });
    it('is returns exception because empty string value', () => {
      const withParams = newWith();
      expect(() => {
        new Client(withParams, gitHubToken, gitHubBaseUrl, '');
      }).toThrow();
    });
  });

  describe('fields', () => {
    it('is full fields', async () => {
      const withParams = {
        ...newWith(),
        status: Success,
        fields:
          'repo,message,commit,author,job,action,eventName,ref,workflow,took,pullRequest',
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
      const payload = getTemplate(withParams.fields, successMsg);
      payload.attachments[0].color = 'good';
      expect(await client.prepare('')).toStrictEqual(payload);
    });
  });

  describe('text is not specified', () => {
    it('is success', async () => {
      const withParams = {
        ...newWith(),
        status: Success,
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
      const payload = getTemplate(withParams.fields, successMsg);
      payload.attachments[0].color = 'good';
      expect(await client.prepare('')).toStrictEqual(payload);
    });
    it('is failure', async () => {
      const withParams = {
        ...newWith(),
        status: Failure,
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
      const payload = getTemplate(withParams.fields, failMsg);
      payload.attachments[0].color = 'danger';
      expect(await client.prepare('')).toStrictEqual(payload);
    });
    it('is cancel', async () => {
      const withParams = {
        ...newWith(),
        status: Cancelled,
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
      const payload = getTemplate(withParams.fields, cancelMsg);
      payload.attachments[0].color = 'warning';
      expect(await client.prepare('')).toStrictEqual(payload);
    });
  });

  it('has no mention', async () => {
    const withParams = {
      ...newWith(),
      status: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('does not match the requirements of the mention', async () => {
    const withParams = {
      ...newWith(),
      status: Success,
      mention: 'here',
      if_mention: Failure,
    };
    let client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    const msg = 'mention test';
    let payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);

    withParams.mention = '';
    withParams.status = Failure;
    client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'danger';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('matches some of the conditions of the mention', async () => {
    const withParams = {
      ...newWith(),
      status: Success,
      mention: 'here',
      if_mention: `${Failure},${Success}`,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on success', async () => {
    const withParams = {
      ...newWith(),
      status: Success,
      mention: 'here',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on failure', async () => {
    const withParams = {
      ...newWith(),
      status: Failure,
      mention: 'here',
      if_mention: Failure,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on cancelled', async () => {
    const withParams = {
      ...newWith(),
      status: Cancelled,
      mention: 'here',
      if_mention: Cancelled,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'warning';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on always', async () => {
    const withParams = {
      ...newWith(),
      status: Success,
      mention: 'here',
      if_mention: Always,
    };
    let client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    const msg = 'mention test';
    let payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);

    payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'danger';
    withParams.status = Failure;
    client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    expect(await client.prepare(msg)).toStrictEqual(payload);

    payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'warning';
    withParams.status = Cancelled;
    client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('mentions one user', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'user_id',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<@user_id> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('can be mentioned here', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'here',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!here> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('can be mentioned channel', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'channel',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(withParams.fields, `<!channel> ${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('mentions a user group', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'subteam^user_group_id',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<!subteam^user_group_id> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('mentions multiple user groups', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'subteam^user_group_id,subteam^user_group_id2',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<!subteam^user_group_id> <!subteam^user_group_id2> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('mentions multiple users', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'user_id,user_id2',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<@user_id> <@user_id2> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('mentions mix of user and user group', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'user_id,subteam^user_group_id',
      if_mention: Success,
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    const msg = 'mention test';
    const payload = getTemplate(
      withParams.fields,
      `<@user_id> <!subteam^user_group_id> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('removes csv space', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      mention: 'user_id, user_id2',
      if_mention: Success,
    };
    let client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    const msg = 'hello';

    let payload = getTemplate(
      withParams.fields,
      `<@user_id> <@user_id2> ${msg}`,
    );
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('returns the expected template', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
    };
    let client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    const msg = 'hello';

    // for success
    let payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'good';
    expect(await client.prepare(msg)).toStrictEqual(payload);

    // for cancel
    withParams.status = Cancelled;
    client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'warning';
    expect(await client.prepare(msg)).toStrictEqual(payload);

    // for fail
    withParams.status = Failure;
    client = new Client(withParams, gitHubToken, gitHubBaseUrl, webhookUrl);
    payload = getTemplate(withParams.fields, msg);
    payload.attachments[0].color = 'danger';
    expect(await client.prepare(msg)).toStrictEqual(payload);
  });

  it('throws error', () => {
    const withParams = newWith();
    expect(() => new Client(withParams, gitHubToken, gitHubBaseUrl)).toThrow(
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

    const withParams = newWith();
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      mockSlackWebhookUrl,
    );

    await client.send('payload');

    expect(fn).toBeCalledTimes(1);
  });
  describe('.custom', () => {
    it('is full fields', async () => {
      const withParams = {
        ...newWith(),
        status: 'custom',
        fields: 'all',
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
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
  describe('#injectColor', () => {
    it('returns an exception that it is an unusual status', () => {
      const withParams = {
        ...newWith(),
        status: 'custom',
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
      expect(() => client.injectColor()).toThrow();
    });
  });
  describe('#injectText', () => {
    it('returns an exception that it is an unusual status', () => {
      const withParams = {
        ...newWith(),
        status: 'custom',
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
      expect(() => client.injectText('')).toThrow();
    });
  });
  describe('mentionText', () => {
    it('returns proper user and group mentions', () => {
      const withParams = {
        ...newWith(),
        status: Success,
        mention: 'test1,test2, here',
        if_mention: Success,
      };
      const client = new Client(
        withParams,
        gitHubToken,
        gitHubBaseUrl,
        webhookUrl,
      );
      expect(client.mentionText(Success)).toStrictEqual(
        '<@test1> <@test2> <!here> ',
      );
    });
  });

  describe('GitHub Enterprise', () => {
    it('is full fields', () => {
      const withParams = {
        ...newWith(),
        status: Success,
        fields:
          'repo,message,commit,author,job,action,eventName,ref,workflow,took,pullRequest',
      };
      const client = new Client(
        withParams,
        gitHubToken,
        'https://your.ghe.com.',
        webhookUrl,
      );
      const payload = getTemplate(withParams.fields, successMsg);
      payload.attachments[0].color = 'good';
    });
  });
});
