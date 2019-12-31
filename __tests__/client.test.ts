process.env.GITHUB_WORKFLOW = 'PR Checks';
process.env.GITHUB_SHA = 'b24f03a32e093fe8d55e23cfd0bb314069633b2f';
process.env.GITHUB_REF = 'refs/heads/feature/19';
process.env.GITHUB_EVENT_NAME = 'push';

import { Client, With } from '../src/client';

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
        '<https://github.com/8398a7/action-slack/commit/b24f03a32e093fe8d55e23cfd0bb314069633b2f|b24f03a32e093fe8d55e23cfd0bb314069633b2f>',
    },
    { short: true, title: 'author', value: '839<8398a7@gmail.com>' },
    {
      short: true,
      title: 'action',
      value:
        '<https://github.com/8398a7/action-slack/commit/b24f03a32e093fe8d55e23cfd0bb314069633b2f/checks|action>',
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

describe('8398a7/action-slack', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = '8398a7/action-slack';
  });

  it('mentions one user', async () => {
    const withParams: With = {
      status: '',
      mention: 'user_id',
      author_name: '',
      only_mention_fail: '',
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

  it('mentions multiple users on failure', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      only_mention_fail: 'user_id',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<@user_id> ${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('does not mention the user unless it is a failure', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      only_mention_fail: 'user_id',
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

  it('can be mentioned here', async () => {
    const withParams: With = {
      status: '',
      mention: 'here',
      author_name: '',
      only_mention_fail: '',
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
    const withParams: With = {
      status: '',
      mention: 'channel',
      author_name: '',
      only_mention_fail: '',
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
    const withParams: With = {
      status: '',
      mention: 'user_id,user_id2',
      author_name: '',
      only_mention_fail: '',
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

  it('mentions multiple users on failure', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      only_mention_fail: 'user_id,user_id2',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<@user_id> <@user_id2> ${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('can be mentioned here on failure', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      only_mention_fail: 'here',
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

  it('can be mentioned channel on failure', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      only_mention_fail: 'channel',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    const msg = 'mention test';
    const payload = getTemplate(`<!channel> ${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('removes csv space', async () => {
    const withParams: With = {
      status: '',
      mention: 'user_id, user_id2',
      author_name: '',
      only_mention_fail: '',
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

    withParams.mention = '';
    withParams.only_mention_fail = 'user_id, user_id2';
    client = new Client(withParams, process.env.GITHUB_TOKEN, '');

    payload = getTemplate(`<@user_id> <@user_id2> ${failMsg}\n${msg}`);
    payload.attachments[0].color = 'danger';
    expect(await client.fail(msg)).toStrictEqual(payload);
  });

  it('returns the expected template', async () => {
    const withParams: With = {
      status: '',
      mention: '',
      author_name: '',
      only_mention_fail: '',
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
});
