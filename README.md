# Action Slack

<p align="left">
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/PR%20Checks/badge.svg"></a>
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg"></a>
</p>

You can notify slack of GitHub Actions.

## Usage

See [action.yml](action.yml), [checkin.yml](.github/workflows/checkin.yml)

### with Parameters

| key               | value                                             | default               | description                            |
| ----------------- | ------------------------------------------------- | --------------------- | -------------------------------------- |
| status            | 'success' or 'failure' or 'cancelled' or 'custom' | ''                    | Recommend `${{ job.status }}`.         |
| text              | any string                                        | ''                    | You can add to text by specifying it.  |
| author_name       | any string                                        | '8398a7@action-slack' | It can be overwritten by specifying.   |
| mention           | 'here' or 'channel' or ''                         | ''                    | Always mention when specified.         |
| only_mention_fail | 'here' or 'channel' or ''                         | ''                    | If specified, mention only on failure. |
| payload           | e.g. `{"text": "Custom Field Check"}`             | ''                    | Only available when status: custom.    |

See here for `payload` reference or [Custom Notification](https://github.com/8398a7/action-slack#custom-notification).  
refs: https://api.slack.com/reference/messaging/payload

### Notification

<img width="495" alt="success" src="https://user-images.githubusercontent.com/8043276/64783194-242f2b00-d5a2-11e9-836c-7a8a4a8b46ae.png">

```yaml
- uses: 8398a7/action-slack@v2
  with:
    status: ${{ job.status }}
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

<img width="489" alt="failure" src="https://user-images.githubusercontent.com/8043276/64783230-42952680-d5a2-11e9-9b92-fafcf3a27353.png">
<img width="483" alt="cancelled" src="https://user-images.githubusercontent.com/8043276/64783296-6a848a00-d5a2-11e9-9b4d-7e00d1d8482d.png">

### Custom Notification

Use `status: custom` if you want to send an arbitrary payload.

<img width="395" alt="custom" src="https://user-images.githubusercontent.com/8043276/63348375-0fd98300-c394-11e9-99dc-6cd78fef2d98.png">

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
