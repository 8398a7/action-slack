---
title: Introduction
metaTitle: This is the title tag of this page
metaDescription: This is the meta description
---

![](https://github.com/8398a7/action-slack/workflows/build-test/badge.svg)
![](https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg)
![](https://img.shields.io/github/license/8398a7/action-slack?color=brightgreen)
![](https://img.shields.io/github/v/release/8398a7/action-slack?color=brightgreen)
[![codecov](https://codecov.io/gh/8398a7/action-slack/branch/master/graph/badge.svg)](https://codecov.io/gh/8398a7/action-slack)

You can notify slack of GitHub Actions.

# Usage

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      author_name: Integration Test # default: 8398a7@action-slack
      mention: here
      if_mention: failure,cancelled
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

<img width="480" alt="success" src="https://user-images.githubusercontent.com/8043276/64882150-7c942480-d697-11e9-9fc8-85e6c02f6aeb.png" />
