# Action Slack

<p align="left">
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/PR%20Checks/badge.svg"></a>
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/Slack%20Checks/badge.svg"></a>
</p>

You can notify slack of GitHub Actions.

## Usage

See [action.yml](action.yml), [checkin.yml](.github/workflows/checkin.yml)

### Succeeded Notification

<img width="436" alt="success" src="https://user-images.githubusercontent.com/8043276/63348255-dd2f8a80-c393-11e9-8890-02be1c502f08.png">

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

<img width="427" alt="failure" src="https://user-images.githubusercontent.com/8043276/63348327-f9cbc280-c393-11e9-8b97-0c63dfe440d7.png">

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

<img width="395" alt="custom" src="https://user-images.githubusercontent.com/8043276/63348375-0fd98300-c394-11e9-99dc-6cd78fef2d98.png">

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

## Next Action

### Selectable Field

Currently the field is fixed, but I want to make it selectable.  
It is assumed that the input is in csv format.

```yaml
- uses: 8398a7/action-slack@v1
  with:
    type: success
    fields: repo,message,action,author
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
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
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # required
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} #required
```
