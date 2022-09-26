# action-slack

[![Netlify Status](https://api.netlify.com/api/v1/badges/a132b9a0-3a80-4938-afa6-2cad038a14a9/deploy-status)](https://app.netlify.com/sites/action-slack/deploys)
![](https://github.com/8398a7/action-slack/workflows/test-build/badge.svg)
![](https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg)
![](https://img.shields.io/github/license/8398a7/action-slack?color=brightgreen)
![](https://img.shields.io/github/v/release/8398a7/action-slack?color=brightgreen)
[![codecov](https://codecov.io/gh/8398a7/action-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/8398a7/action-slack)

- [Document](https://action-slack.netlify.app)

## Quick Start

You can learn more about it [here](https://action-slack.netlify.app/usecase/01-general).

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow,job,took,pullRequest # selectable (default: repo,message)
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

<img width="495" alt="success" src="https://user-images.githubusercontent.com/8043276/84587112-64844800-ae57-11ea-8007-7ce83a91dae3.png" />

## Custom Formats of your choice

You can learn more about it [here](https://action-slack.netlify.app/usecase/02-custom).

```yaml
steps:
  - uses: 8398a7/action-slack@v3
  with:
    status: custom
    fields: workflow,job,commit,repo,ref,author,took
    custom_payload: |
      {
        attachments: [{
          color: '${{ job.status }}' === 'success' ? 'good' : '${{ job.status }}' === 'failure' ? 'danger' : 'warning',
          text: `${process.env.AS_WORKFLOW}\n${process.env.AS_JOB} (${process.env.AS_COMMIT}) of ${process.env.AS_REPO}@${process.env.AS_REF} by ${process.env.AS_AUTHOR} ${{ job.status }} in ${process.env.AS_TOOK}`,
        }]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: always() # Pick up events even if the job fails or is canceled.
```

<img width="501" alt="custom" src="https://user-images.githubusercontent.com/8043276/85949864-2b3df300-b994-11ea-9388-f4ff1aebc292.png">

## For GitHub Enterprise

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      github_base_url: https://your.ghe.com # Specify your GHE
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow,job,took,pullRequest
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    if: always()
```

## Require Permissions

If you are explicitly specifying permissions, must grant `contents` and `actions`.

```yaml
permissions:
  contents: read
  actions: read
```
