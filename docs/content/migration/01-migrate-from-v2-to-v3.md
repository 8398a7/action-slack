---
title: migrate from v2 to v3
---

## Fields in the slack will be selective.

In v2, the fields were automatically selected.

```yaml
steps:
  - uses: 8398a7/action-slack@v2
    with:
      status: ${{ job.status }}
    env:
      GITHUB_TOKEN: ${{ github.token }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

If the selection is done automatically, it will also show fields that the user thought were unnecessary.  
From v3, fields not explicitly specified by the user will not be displayed.  
If you want the behavior to be the same as v2, please specify the following.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

## Overwriting text

Until v2, a fixed statement (success/failure/cancel) was inserted for each status.  
This means that even if the user specifies `text`, a fixed sentence is given at the beginning.

From v3, if text is specified, it will remove the fixed sentence and completely overwrite it.  
For example, in v2, ":white_check_mark: Succeeded GitHub Actions" was fixed on a successful job.  
If a user wants to change :white_check_mark: to a different emoji, it will still be fixed, but from v3 it will be completely overwritten, which eliminates this problem.

## Change the way Mentions are set up

In v2, there are two features for Mentions.

- mention
  - Any status will be mentioned.
- only_mention_fail
  - Mentions are only made when the job fails.

In v3, it will be changed to `mention` and `if_mention`.  
This change is intended to consolidate the roles, as the existing method of mentoring was close to the roles and was a confusing feature.

`if_mention` specifies the state to fire, and `mention` specifies the target partner.  
See [With Parameters](/with) for the other states that can be specified by `if_mention`.

### Migrate mention

If you have set the following in v2

```yaml
steps:
  - uses: 8398a7/action-slack@v2
    with:
      status: ${{ job.status }}
      mention: here
    env:
      GITHUB_TOKEN: ${{ github.token }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

in v3, it reads as follows.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      mention: here
      if_mention: always
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### Migrate only_mention_fail

If you have set the following in v2

```yaml
steps:
  - uses: 8398a7/action-slack@v2
    with:
      status: ${{ job.status }}
      only_mention_fail: here
    env:
      GITHUB_TOKEN: ${{ github.token }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

in v3, it reads as follows.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      mention: here
      if_mention: failure
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

## Abolition of payload

`payload` has been changed to `custom_payload`.  
The `payload` will change to have a reserved word role in GitHub Actions.

If you have set the following in v2

```yaml
steps:
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
      GITHUB_TOKEN: ${{ github.token }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

in v3, it reads as follows.

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
