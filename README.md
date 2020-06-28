# action-slack

![](https://github.com/8398a7/action-slack/workflows/build-test/badge.svg)
![](https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg)
![](https://img.shields.io/github/license/8398a7/action-slack?color=brightgreen)
![](https://img.shields.io/github/v/release/8398a7/action-slack?color=brightgreen)
[![codecov](https://codecov.io/gh/8398a7/action-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/8398a7/action-slack)


- [Document](https://action-slack.netlify.com)

## Quick Start

You can learn more about it [here](https://action-slack.netlify.com/usecase/01-general).

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow,job,took # selectable (default: repo,message)
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

<img width="495" alt="success" src="https://user-images.githubusercontent.com/8043276/84587112-64844800-ae57-11ea-8007-7ce83a91dae3.png" />

## Custom Formats of your choice

You can learn more about it [here](https://action-slack.netlify.com/usecase/02-custom).

```yaml
steps:
  - uses: 8398a7/action-slack@v3
  with:
    status: custom
    fields: workflow,job,commit,repo,ref,author,took
    custom_payload: |
      {
        username: 'action-slack',
        icon_emoji: ':octocat:',
        attachments: [{
          color: '${{ job.status }}' === 'success' ? 'good' : '${{ job.status }}' === 'failure' ? 'danger' : 'warning',
          text: `${process.env.AS_WORKFLOW}\n${process.env.AS_JOB} (${process.env.AS_COMMIT}) of ${process.env.AS_REPO}@master by ${process.env.AS_AUTHOR} succeeded in ${process.env.AS_TOOK}`,
        }]
      }
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

<img width="510" alt="custom" src="https://user-images.githubusercontent.com/8043276/85949706-44926f80-b993-11ea-83bf-b3f81e5e2d8c.png">
