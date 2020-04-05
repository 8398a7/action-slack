---
title: Usage
metaTitle: Usage | action-slack
metaDescription: This is usage to action-slack.
---

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      author_name: Integration Test # default: 8398a7@action-slack
      fields: repo,commit,message,author # default: repo,commit
      mention: here
      if_mention: failure,cancelled
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```
