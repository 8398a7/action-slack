---
title: General use case
---

Notify slack of the results of a single job run.

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

`status: ${{ job.status }}` allows a job to succeed, fail or cancel etc. to action-slack.
`if: always()` to trigger action-slack even if the job fails Let them.

For the fields, look at [Fields](/usage/fields) to determine what you want.
