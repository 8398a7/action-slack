---
title: Custom use case
---

You will often want to send notifications in a format other than the one that action-slack has determined.  
In such a case, consider using `status: custom`.

If you specify a payload in accordance with the slack specification, action-slack will notify you as it is.  
Use `status: custom` and [custom_payload](/usage/with#custom_payload) to customize notifications to your liking can be sent.

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

As you can see, the JavaScript functionality is available in the custom_payload . (e.g. `toLowerCase()`)  
We have even more options for those who want to use custom notifications, but want to use the Fields feature.

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

You can access the values retrieved by Fields through environment variables.  
See [Fields](/usage/fields) for the available environment variables.

<img width="501" alt="custom" src="https://user-images.githubusercontent.com/8043276/85949864-2b3df300-b994-11ea-9388-f4ff1aebc292.png" />

If there's a good format, I'd like to introduce it on this page from time to time.
