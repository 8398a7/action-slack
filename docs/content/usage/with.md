---
title: With Parameters
weight: 1
---

This page describes the elements that can be specified in with.

## List

| key                                    | value                                                                                                                                                                                                | default                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [status](#status)                 | `'success'` or `'failure'` or `'cancelled'` or `'custom'`                                                                                                                                            | `''`                    |
| [fields](/usage/fields)                      | You can choose the items you want to add to the fields at the time of notification.                                                                                                                  | `'repo,commit'`         |
| [text](#text)                     | Specify the text you want to add. All strings will be overwritten.                                                                                                                                   | `''`                    |
| [author_name](#author_name)       | It can be overwritten by specifying. The job name is recommend.                                                                                                                                      | `'8398a7@action-slack'` |
| [mention](#mention)               | `'here'` or `'channel'` or [user_group_id](https://api.slack.com/reference/surfaces/formatting#mentioning-groups) or [user_id](https://api.slack.com/reference/surfaces/formatting#mentioning-users) | `''`                    |
| [if_mention](#mention)            | Specify `'success'` or `'failure'` or `'cancelled'` or `'custom'` or `'always'`.                                                                                                                     | `''`                    |
| [username](#username)             | Override the legacy integration's default name.                                                                                                                                                      | `''`                    |
| [icon_emoji](#icon_emoji)         | [emoji code](https://www.webfx.com/tools/emoji-cheat-sheet/) string to use in place of the default icon.                                                                                             | `''`                    |
| [icon_url](#icon_url)             | icon image URL string to use in place of the default icon.                                                                                                                                           | `''`                    |
| [channel](#channel)               | Override the legacy integration's default channel. This should be an ID, such as `C8UJ12P4P`.                                                                                                        | `''`                    |
| [custom_payload](#custom_payload) | e.g. `{"text": "Custom Field Check", obj: 'LOWER CASE'.toLowerCase()}`                                                                                                                               | `''`                    |
| [job_name](#job_name)             | If you want to overwrite the job name, you must specify it.                                                                                                                                          | `''`                    |

### status

Recommend `${{ job.status }}`.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### text

e.g.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      text: 'any string'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### author_name

e.g.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      author_name: 'my workflow'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### mention

This can be mentioned in combination with `if_mention`.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      mention: 'here'
      if_mention: failure
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

If you want to mention multiple users in multiple cases, you can specify.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      mention: 'user_id,user_id2'
      if_mention: 'failure,cancelled'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

If you want to mention a user group, you need to add "subteam^" before user group id. 

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      mention: 'subteam^S012ABC3Y4Z' # replace S012ABC3Y4Z with your user group id 
      if_mention: 'failure,cancelled'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```


### username

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      username: 'my workflow bot'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### icon_emoji

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      icon_emoji: ':octocat:'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### icon_url

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      icon_url: 'http://example.com/hoge.png'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### channel

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      channel: '#general'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### custom_payload

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: custom
      custom_payload: |
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
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

See here for `custom_payload` reference.

- [Message Formatting](https://api.slack.com/docs/messages/builder)
  - Enter json and check in preview.
- [Reference: Message payloads](https://api.slack.com/reference/messaging/payload)

### job_name

In the action-slack, there are arguments to get the information about the job.  
They are retrieved from the job name and will not work if the job name is overwritten.

If you want to rename a job and get information about it, give the job a `job_name`.

```yaml
jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: 8398a7/action-slack@v3
        with:
          job_name: Test # Match the name above.
          fields: job,took
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```
