---
title: Fields
weight: 2
---

{{% notice title="caution" style="warning" %}}
Additional configuration is required to work with matrix.
Don't forget to add `MATRIX_CONTEXT`.
Not required if the fields do not contain jobs or tooks.

{{% /notice %}}

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

| Field       | Environment Variable    | Description                                                 |
| ----------- | ----------------------- | ----------------------------------------------------------- |
| repo        | `AS_REPO`               | A working repository name                                   |
| commit      | `AS_COMMIT`             | commit hash                                                 |
| eventName   | `AS_EVENT_NAME`         | trigger event name                                          |
| ref         | `AS_REF`                | git reference                                               |
| workflow    | `AS_WORKFLOW`           | Generate a workflow link from git sha                       |
| workflowRun | `AS_WORKFLOW_RUN`       | Generate a link to the present workflow run                 |
| message     | `AS_MESSAGE`            | commit message                                              |
| author      | `AS_AUTHOR`             | The author who pushed                                       |
| job         | `AS_JOB`                | Generate a job run link of the job that was executed        |
| took        | `AS_TOOK`               | Execution time for the job                                  |
| pullRequest | `AS_PULL_REQUEST`       | Pull Request title, number with link                        |

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

In either of the following cases, You must use the `job_name` parameter instead of the `MATRIX_CONTEXT`.

1. Overwrite job name by `name` syntax
1. Using `matrix` with `include`

Because when constructing the job name in the action-slack, the key specified by `include` is included in the `matrix` map.
It does not match the actual job name.

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-18.04]
        node: [8, 10, 12, 14]
        include:
          - os: windows-latest
            node: 8
            npm: 6

    steps:
      - uses: 8398a7/action-slack@v3
        with:
          job_name: test (${{ matrix.os }}, ${{ matrix.node }}) # named without `npm`
          fields: job,took
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```
