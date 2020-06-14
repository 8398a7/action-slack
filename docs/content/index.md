---
title: action-slack
metaTitle: action-slack
metaDescription: You can notify slack of GitHub Actions.
---

![](https://github.com/8398a7/action-slack/workflows/build-test/badge.svg)
![](https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg)
![](https://img.shields.io/github/license/8398a7/action-slack?color=brightgreen)
![](https://img.shields.io/github/v/release/8398a7/action-slack?color=brightgreen)
[![codecov](https://codecov.io/gh/8398a7/action-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/8398a7/action-slack)

You can notify slack of GitHub Actions.

- [Usage](/usage)
- [v2 Document Link](https://github.com/8398a7/action-slack/blob/v2/README.md)

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow # selectable (default: repo,message)
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

<img width="495" alt="success" src="https://user-images.githubusercontent.com/8043276/84587112-64844800-ae57-11ea-8007-7ce83a91dae3.png" />
