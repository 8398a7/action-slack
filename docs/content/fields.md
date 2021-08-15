---
title: Fields
metaTitle: Fields | action-slack
metaDescription: This explains the values that can be specified in Fields.
---

caution: Additional configuration is required to work with matrix.

Don't forget to add `MATRIX_CONTEXT`.  
Not required if the fields do not contain jobs or tooks.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      fields: job,took
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
      MATRIX_CONTEXT: ${{ toJson(matrix) }} # required
```

If you have more than one, please enter it in csv format.  
Corresponding types are as follows.

<img width="495" alt="success" src="https://user-images.githubusercontent.com/8043276/84587112-64844800-ae57-11ea-8007-7ce83a91dae3.png" />

| Field     | Environment Variable    | Description                                                  |
| --------- | ----------------------- | ------------------------------------------------------------ |
| repo      | `AS_REPO`               | A working repository name                                    |
| commit    | `AS_COMMIT`             | commit hash                                                  |
| eventName | `AS_EVENT_NAME`         | trigger event name                                           |
| ref       | `AS_REF`                | git refrence                                                 |
| workflow  | `AS_WORKFLOW`           | Generate a workflow link from git sha                        |
| message   | `AS_MESSAGE`            | commit message                                               |
| author    | `AS_AUTHOR`             | The author who pushed                                        |
| job       | `AS_JOB`                | Generate a job run link of the job that was executed         |
| took      | `AS_TOOK`               | Execution time for the job                                   |

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      fields: repo,commit
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

If you want all items, specify `all`.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      fields: all
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```
