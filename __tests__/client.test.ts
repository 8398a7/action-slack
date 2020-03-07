import nock from 'nock';
import { readFileSync } from 'fs';
import { resolve } from 'path';

process.env.GITHUB_WORKFLOW = 'PR Checks';
process.env.GITHUB_SHA = 'b24f03a32e093fe8d55e23cfd0bb314069633b2f';
process.env.GITHUB_REF = 'refs/heads/feature/19';
process.env.GITHUB_EVENT_NAME = 'push';
process.env.GITHUB_TOKEN = 'test-token';

import {
  Client,
  With,
  Success,
  Failure,
  Cancelled,
  Always,
} from '../src/client';

const fixedFields = () => {
  return [
    {
      short: true,
      title: 'repo',
      value: '<https://github.com/8398a7/action-slack|8398a7/action-slack>',
    },
    {
      short: true,
      title: 'message',
      value: '[#19] support for multiple user mentions',
    },
    {
      short: true,
      title: 'commit',
      value:
        `<https://github.com/8398a7/action-slack/commit/${process.env.GITHUB_SHA}|${process.env.GITHUB_SHA}>`,
    },
    { short: true, title: 'author', value: '839<8398a7@gmail.com>' },
    {
      short: true,
      title: 'action',
      value:
        `<https://github.com/8398a7/action-slack/commit/${process.env.GITHUB_SHA}/checks|action>`,
    },
    { short: true, title: 'eventName', value: process.env.GITHUB_EVENT_NAME },
    { short: true, title: 'ref', value: process.env.GITHUB_REF },
    { short: true, title: 'workflow', value: process.env.GITHUB_WORKFLOW },
  ];
};

const getTemplate: any = (text: string) => {
  return {
    text,
    attachments: [
      {
        author_name: '',
        color: '',
        fields: fixedFields(),
      },
    ],
    username: '',
    icon_emoji: '',
    icon_url: '',
    channel: '',
  };
};

const successMsg = ':white_check_mark: Succeeded GitHub Actions';
const cancelMsg = ':warning: Canceled GitHub Actions';
const failMsg = ':no_entry: Failed GitHub Actions';
const fixturesDir = resolve(__dirname, 'fixtures');

const getApiFixture = (name: string): string => JSON.parse(readFileSync(resolve(fixturesDir, `${name}.json`)).toString());

describe('8398a7/action-slack', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = '8398a7/action-slack';
    process.env.GITHUB_EVENT_NAME = 'push';
    process.env.GITHUB_SHA = 'b24f03a32e093fe8d55e23cfd0bb314069633b2f';
    const github = require('@actions/github');
    github.context.payload = {};
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('has no mention', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
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
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('does not match the requirements of the mention', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Failure,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    let client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    let payload = getTemplate(`${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);

    withParams.mention = '';
    client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    payload = getTemplate(`${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('matches some of the conditions of the mention', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: `${Failure},${Success}`,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<!here> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on success', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<!here> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on failure', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Failure,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<!here> ${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on cancelled', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Cancelled,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<!here> ${cancelMsg}\n${msg}`);
    payload.attachments[0].color = 'warning';
    expect(await client.cancel(msg)).toStrictEqual(payload);
  });

  it('can be mentioned on always', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Always,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    let payload = getTemplate(`<!here> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);

    payload = getTemplate(`<!here> ${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);

    payload = getTemplate(`<!here> ${cancelMsg}\n${msg}`);
    payload.attachments[0].color = 'warning';
    expect(await client.cancel(msg)).toStrictEqual(payload);
  });

  it('mentions one user', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'user_id',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<@user_id> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned here', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<!here> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('can be mentioned channel', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'channel',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<!channel> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('mentions multiple users', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'user_id,user_id2',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<@user_id> <@user_id2> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('removes csv space', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
        .reply(200, () => getApiFixture('repos.commits.get'));
    const withParams: With = {
      status: '',
      mention: 'user_id, user_id2',
      author_name: '',
      if_mention: Success,
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    let client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'hello';

    let payload = getTemplate(`<@user_id> <@user_id2> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });

  it('returns the expected template', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
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
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'hello';

    // for success
    let payload = getTemplate(`${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);

    // for cancel
    payload = getTemplate(`${cancelMsg}\n${msg}`);
    payload.attachments[0].color = 'warning';
    expect(await client.cancel(msg)).toStrictEqual(payload);

    // for fail
    payload = getTemplate(`${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('works without GITHUB_TOKEN', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/b24f03a32e093fe8d55e23cfd0bb314069633b2f')
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
    };
    const client = new Client(withParams, undefined, '');
    const payload = getTemplate(`${successMsg}\n`);
    payload.attachments[0].color = 'good';
    payload.attachments[0].fields = payload.attachments[0].fields.filter(
      (field: any) => !['message', 'author'].includes(field.title),
    );
    expect(await client.success('')).toStrictEqual(payload);
  });

  it('works on pull request event', async () => {
    nock('https://api.github.com')
        .persist()
        .get('/repos/8398a7/action-slack/commits/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        .reply(200, () => getApiFixture('repos.commits.get'));

    process.env.GITHUB_EVENT_NAME = 'pull_request';
    process.env.GITHUB_SHA = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const github = require('@actions/github');
    github.context.payload = {
      'pull_request': {
        number: 123,
        head: {
          sha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }
      }
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
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<@user_id> ${successMsg}\n${msg}`);
    payload.attachments[0].color = 'good';
    expect(await client.success(msg)).toStrictEqual(payload);
  });
});
