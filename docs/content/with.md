---
title: With Parameters
metaTitle: This is the title tag of this page
metaDescription: This is the meta description
---

This page describes the elements that can be specified in with.

# List

|key|value|default|
|---|---|---|
|[status](/with#status)|`'success'` or `'failure'` or `'cancelled'` or `'custom'`|`''`|
|[text](/with#text)|Specify the text you want to add.|`''`|
|[author_name](/with#author_name)|It can be overwritten by specifying. The job name is recommend.|`'8398a7@action-slack'`|
|[mention](/with#mention)|`'here'` or `'channel'` or [user_id](https://api.slack.com/reference/surfaces/formatting#mentioning-users)|`''`|
|[if_mention](/with#mention)|Specify `'success'` or `'failure'` or `'cancelled'` or `'custom'` or `'always'`.|`''`|
|[username](/with#username)|Override the legacy integration's default name.|`''`|
|[icon_emoji](/with#icon_emoji)|[emoji code](https://www.webfx.com/tools/emoji-cheat-sheet/) string to use in place of the default icon.|`''`|
|[icon_url](/with#icon_url)|icon image URL string to use in place of the default icon.|`''`|
|[channel](/with#channel)|Override the legacy integration's default channel. This should be an ID, such as `C8UJ12P4P`.|`''`|
|[payload](/with#payload)|e.g. `{"text": "Custom Field Check", obj: 'LOWER CASE'.toLowerCase()}`|`''`|

# status

Recommend `${{ job.status }}`.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# text

e.g.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      text: 'any string'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# author_name

e.g.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      author_name: 'my workflow'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# mention

This can be mentioned in combination with `if_mention`.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      mention: 'here'
      if_mention: failure
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
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
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# username

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      username: 'my workflow bot'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# icon_emoji

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      icon_emoji: ':octocat:'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# icon_url

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      icon_url: 'http://example.com/hoge.png'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# channel

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      channel: '#general'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

# payload

```yaml
steps:
  - uses: 8398a7/action-slack@v3
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

See here for `payload` reference or [Custom Notification](https://github.com/8398a7/action-slack#custom-notification).

- [Message Formatting](https://api.slack.com/docs/messages/builder)
  - Enter json and check in preview.
- [Reference: Message payloads](https://api.slack.com/reference/messaging/payload)
