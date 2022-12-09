---
title: action-slack
---

## action-slack

You can notify slack of GitHub Actions.

![success](https://user-images.githubusercontent.com/8043276/185978284-4c2c5683-5d0d-4a8e-a0f8-1e74c2c8d1fa.png)

- [Usage](/usage)
- [v2 Document Link](https://github.com/8398a7/action-slack/blob/v2/README.md)

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow # selectable (default: repo,message)
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

[![Netlify Status](https://api.netlify.com/api/v1/badges/a132b9a0-3a80-4938-afa6-2cad038a14a9/deploy-status)](https://app.netlify.com/sites/action-slack/deploys)
![](https://github.com/8398a7/action-slack/workflows/build-test/badge.svg)
![](https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg)
![](https://img.shields.io/github/license/8398a7/action-slack?color=brightgreen)
![](https://img.shields.io/github/v/release/8398a7/action-slack?color=brightgreen)
[![codecov](https://codecov.io/gh/8398a7/action-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/8398a7/action-slack)
