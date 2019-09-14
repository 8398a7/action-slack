# Action Slack

<p align="left">
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/PR%20Checks/badge.svg"></a>
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg"></a>
</p>

You can notify slack of GitHub Actions.

## Usage

See [action.yml](action.yml), [checkin.yml](.github/workflows/checkin.yml)

### with Parameters

| key               | value                                             | default               | description                                                                                                 |
| ----------------- | ------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| status            | 'success' or 'failure' or 'cancelled' or 'custom' | ''                    | Recommend<br />`${{ job.status }}`.                                                                         |
| text              | any string                                        | ''                    | You can add to text by specifying it.                                                                       |
| author_name       | any string                                        | '8398a7@action-slack' | It can be overwritten by specifying. The job name is recommend.                                             |
| mention           | 'here' or 'channel' or ''                         | ''                    | Always mention when specified.                                                                              |
| only_mention_fail | 'here' or 'channel' or ''                         | ''                    | If specified, mention only on failure.                                                                      |
| payload           | e.g. `{"text": "Custom Field Check"}`             | ''                    | Only available when status: custom.                                                                         |
| username          | Only legacy incoming webhook supported.           | ''                    | override the legacy integration's default name.                                                             |
| icon_emoji        | Only legacy incoming webhook supported.           | ''                    | an [emoji code](https://www.webfx.com/tools/emoji-cheat-sheet/) string to use in place of the default icon. |
| icon_url          | Only legacy incoming webhook supported.           | ''                    | an icon image URL string to use in place of the default icon.                                               |
| channel           | Only legacy incoming webhook supported.           | ''                    | override the legacy integration's default channel. This should be an ID, such as `C8UJ12P4P`.               |

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
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
  if: always() # Pick up events even if the job fails or is canceled.
```

When adding to text, write as follows.

```yaml
- uses: 8398a7/action-slack@v2
  with:
    type: ${{ job.status }}
    text: overwrite text
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

In case of failure or cancellation, you will be notified as follows.

<img width="483" alt="failure" src="https://user-images.githubusercontent.com/8043276/64882189-933a7b80-d697-11e9-8afc-56530176a15e.png">
<img width="484" alt="cancelled" src="https://user-images.githubusercontent.com/8043276/64882212-a3525b00-d697-11e9-8e98-aa5e515b304f.png">

### Custom Notification

Use `status: custom` if you want to send an arbitrary payload.

<img width="395" alt="custom" src="https://user-images.githubusercontent.com/8043276/64882303-cc72eb80-d697-11e9-8027-b7de99e0d587.png">

```yaml
- uses: 8398a7/action-slack@v2
  with:
    status: custom
    payload: |
      { "text": "Custom Field Check",
        "attachments": [{
          "author_name": "slack-actions",
          "fallback": "fallback",
          "color": "good",
          "title": "CI Result",
          "text": "Succeeded",
          "fields": [{
            "title": "short title1",
            "value": "short value1",
            "short": true
          },
          {
            "title": "short title2",
            "value": "short value2",
            "short": true
          },
          {
            "title": "long title1",
            "value": "long value1",
            "short": false
          }],
          "actions": [{
          }]
        }]
      }
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
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
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```
