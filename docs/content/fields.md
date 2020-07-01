---
title: Fields
metaTitle: Fields | action-slack
metaDescription: This explains the values that can be specified in Fields.
---

If you have more than one, please enter it in csv format.  
Corresponding types are as follows.

<img width="495" alt="success" src="https://user-images.githubusercontent.com/8043276/84587112-64844800-ae57-11ea-8007-7ce83a91dae3.png" />

| Field     | Required `GITHUB_TOKEN` | Environment Variable | Description                           |
| --------- | ----------------------- | -------------------- | ------------------------------------- |
| repo      | no                      | `AS_REPO`            | A working repository name             |
| commit    | no                      | `AS_COMMIT`          | commit hash                           |
| eventName | no                      | `AS_EVENT_NAME`      | trigger event name                    |
| ref       | no                      | `AS_REF`             | git refrence                          |
| workflow  | no                      | `AS_WORKFLOW`        | GitHub Actions workflow name          |
| action    | no                      | `AS_ACTION`          | Generate a workflow link from git sha |
| message   | yes                     | `AS_MESSAGE`         | commit message                        |
| author    | yes                     | `AS_AUTHOR`          | The author who pushed                 |
| job       | yes                     | `AS_JOB`             | The name of the job that was executed |
| took      | yes                     | `AS_TOOK`            | Execution time for the job            |

caution: The Field in `action` is similar to what you get in workflow. It will be removed in the next major release version.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      fields: repo,commit
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

If you want all items, specify `all`.

```yaml
steps:
  - uses: 8398a7/action-slack@v3
    with:
      fields: all
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # optional
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```
