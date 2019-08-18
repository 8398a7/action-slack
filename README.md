# Action Slack

<p align="left">
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/PR%20Checks/badge.svg"></a>
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/Slack%20Checks/badge.svg"></a>
</p>

You can notify slack of GitHub Actions.

## Usage

See [action.yml](action.yml), [checkin.yml](.github/workflows/checkin.yml)

### Succeeded Notification

![](https://user-images.githubusercontent.com/8043276/63113235-10a59a00-bfcd-11e9-83be-2dd8662c9ebb.png)

```yaml
- uses: 8398a7/action-slack@v1
  with:
    type: success
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
- uses: 8398a7/action-slack@v1
  with:
    type: success
    text: overwrite text
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Failed Notification

![](https://user-images.githubusercontent.com/8043276/63225165-8ba6c480-c208-11e9-841e-4d167028355f.png)

```yaml
- uses: 8398a7/action-slack@v1
  with:
    type: failure
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
- uses: 8398a7/action-slack@v1
  with:
    type: failure
    failedMention: channel # The default is here. No mention if empty character specified.
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Custom Notification

![](https://user-images.githubusercontent.com/8043276/63113021-9f65e700-bfcc-11e9-97cf-9a962c7ce611.png)

```yaml
- uses: 8398a7/action-slack@v0
  with:
    payload: |
      {
        "text": "Custom Field Check",
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
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Auto Notification

We are considering an automatic handling mode based on the job status.  
I'm leaving it because I don't seem to get the information.

```yaml
- uses: 8398a7/action-slack@v1
  with:
    type: auto
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
