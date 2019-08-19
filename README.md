# Action Slack

<p align="left">
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/PR%20Checks/badge.svg"></a>
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/Slack%20Checks/badge.svg"></a>
</p>

You can notify slack of GitHub Actions.

## Usage

See [action.yml](action.yml), [checkin.yml](.github/workflows/checkin.yml)

### Succeeded Notification

![](https://user-images.githubusercontent.com/8043276/63276385-3e952200-c2de-11e9-9f07-7e0fc4cf8d3a.png)

```yaml
- uses: 8398a7/action-slack@v1
  with:
    type: success
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
- uses: 8398a7/action-slack@v1
  with:
    type: success
    text: overwrite text
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### Failure Notification

![](https://user-images.githubusercontent.com/8043276/63276493-6edcc080-c2de-11e9-97df-861d6564a888.png)

```yaml
- uses: 8398a7/action-slack@v1
  with:
    type: failure
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
- uses: 8398a7/action-slack@v1
  with:
    type: failure
    failedMention: channel # The default is here. No mention if empty character specified.
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### Custom Notification

![](https://user-images.githubusercontent.com/8043276/63276528-86b44480-c2de-11e9-9ad9-42a33d638c4c.png)

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
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
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
