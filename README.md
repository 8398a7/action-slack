# action-slack

![](https://github.com/8398a7/action-slack/workflows/build-test/badge.svg)
![](https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg)
![](https://img.shields.io/github/license/8398a7/action-slack?color=brightgreen)
![](https://img.shields.io/github/v/release/8398a7/action-slack?color=brightgreen)
[![codecov](https://codecov.io/gh/8398a7/action-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/8398a7/action-slack)

You can notify slack of GitHub Actions.  
For v3 or later under development, write the document [here](https://action-slack.netlify.com).

## Usage

See [action.yml](action.yml), [test.yml](.github/workflows/test.yml)

### with Parameters

| key               | value                                                                                                                                     | default               | description                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| status            | 'success' or 'failure' or 'cancelled' or 'custom'                                                                                         | ''                    | Recommend<br />`${{ job.status }}`.                                                                         |
| text              | any string                                                                                                                                | ''                    | You can add to text by specifying it.                                                                       |
| author_name       | any string                                                                                                                                | '8398a7@action-slack' | It can be overwritten by specifying. The job name is recommend.                                             |
| mention           | 'here' or 'channel' or [user_id](https://api.slack.com/reference/surfaces/formatting#mentioning-users) (e.g. `mention: user_id,user_id2`) | ''                    | Always mention when specified.                                                                              |
| only_mention_fail | 'here' or 'channel' or [user_id](https://api.slack.com/reference/surfaces/formatting#mentioning-users) (e.g. `mention: user_id,user_id2`) | ''                    | If specified, mention only on failure.                                                                      |
| payload           | e.g. `{"text": "Custom Field Check", obj: 'LOWER CASE'.toLowerCase()}`                                                                    | ''                    | Only available when status: custom. The payload format can pass javascript object.                          |
| username          | Only legacy incoming webhook supported.                                                                                                   | ''                    | override the legacy integration's default name.                                                             |
| icon_emoji        | Only legacy incoming webhook supported.                                                                                                   | ''                    | an [emoji code](https://www.webfx.com/tools/emoji-cheat-sheet/) string to use in place of the default icon. |
| icon_url          | Only legacy incoming webhook supported.                                                                                                   | ''                    | an icon image URL string to use in place of the default icon.                                               |
| channel           | Only legacy incoming webhook supported.                                                                                                   | ''                    | override the legacy integration's default channel. This should be an ID, such as `C8UJ12P4P`.               |

See here for `payload` reference or [Custom Notification](https://github.com/8398a7/action-slack#custom-notification).

- [Message Formatting](https://api.slack.com/docs/messages/builder)
  - Enter json and check in preview.
- [Reference: Message payloads](https://api.slack.com/reference/messaging/payload)

### Notification

<img width="480" alt="success" src="https://user-images.githubusercontent.com/8043276/64882150-7c942480-d697-11e9-9fc8-85e6c02f6aeb.png">

```yaml
- uses: 8398a7/action-slack@v2
  with:
    status: ${{ job.status }}
    author_name: Integration Test # default: 8398a7@action-slack
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
  if: always() # Pick up events even if the job fails or is canceled.
```

When adding to text, write as follows.

```yaml
- uses: 8398a7/action-slack@v2
  with:
    status: ${{ job.status }}
    text: overwrite text
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

In case of failure or cancellation, you will be notified as follows.

<img width="483" alt="failure" src="https://user-images.githubusercontent.com/8043276/64882189-933a7b80-d697-11e9-8afc-56530176a15e.png">
<img width="484" alt="cancelled" src="https://user-images.githubusercontent.com/8043276/64882212-a3525b00-d697-11e9-8e98-aa5e515b304f.png">

#### Legacy Incoming Webhooks

If you specify as follows, you can also support legacy incoming webhooks.  
The specified `secrets.SLACK_WEBHOOK_URL` must be legacy.

```yaml
- uses: 8398a7/action-slack@v2
  with:
    type: ${{ job.status }}
    username: Custom Username
    icon_emoji: ':octocat:'
    channel: '#integration-test'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### Custom Notification

Use `status: custom` if you want to send an arbitrary payload.  
The payload format can pass javascript object.

<img width="401" alt="custom" src="https://user-images.githubusercontent.com/8043276/64948009-1aaf0700-d8b1-11e9-868e-00be274821cf.png">

```yaml
- uses: 8398a7/action-slack@v2
  with:
    status: custom
    payload: |
      {
        text: "Custom Field Check",
        attachments: [{
          "author_name": "8398a7@action-slack", // json
          fallback: 'fallback',
          color: 'good',
          title: 'CI Result',
          text: 'Succeeded',
          fields: [{
            title: 'lower case',
            value: 'LOWER CASE CHECK'.toLowerCase(),
            short: true
          },
          {
            title: 'reverse',
            value: 'gnirts esrever'.split('').reverse().join(''),
            short: true
          },
          {
            title: 'long title1',
            value: 'long value1',
            short: false
          }],
          actions: [{
          }]
        }]
      }
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

## Next Action

### Selectable Field

Currently the field is fixed, but I want to make it selectable.  
It is assumed that the input is in csv format.

```yaml
- uses: 8398a7/action-slack@v2
  with:
    status: ${{ job.status }}
    fields: repo,message,action,author
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```
