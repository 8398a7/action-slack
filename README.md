# Action Slack (customized)

<p align="left">
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/PR%20Checks/badge.svg"></a>
  <a href="https://github.com/8398a7/action-slack"><img alt="GitHub Actions status" src="https://github.com/8398a7/action-slack/workflows/Slack%20Mainline/badge.svg"></a>
</p>

You can notify slack of GitHub Actions.
This is the customized version of `8398a7/action-slack`, which shows information in single row.

## Usage

See [action.yml](action.yml), [checkin.yml](.github/workflows/checkin.yml)

### with Parameters

| key               | value                                                                  | default               | description                                                                                                 |
| ----------------- | ---------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| status            | 'success' or 'failure' or 'cancelled' or 'custom'                      | ''                    | Recommend<br />`${{ job.status }}`.                                                                         |
| text              | any string                                                             | ''                    | You can add to text by specifying it.                                                                       |
| author_name       | any string                                                             | 'ykodama@action-slack' | It can be overwritten by specifying. The job name is recommend.                                             |
| mention           | 'here' or 'channel' or ''                                              | ''                    | Always mention when specified.                                                                              |
| only_mention_fail | 'here' or 'channel' or ''                                              | ''                    | If specified, mention only on failure.                                                                      |
| payload           | e.g. `{"text": "Custom Field Check", obj: 'LOWER CASE'.toLowerCase()}` | ''                    | Only available when status: custom. The payload format can pass javascript object.                          |
| username          | Only legacy incoming webhook supported.                                | ''                    | override the legacy integration's default name.                                                             |
| icon_emoji        | Only legacy incoming webhook supported.                                | ''                    | an [emoji code](https://www.webfx.com/tools/emoji-cheat-sheet/) string to use in place of the default icon. |
| icon_url          | Only legacy incoming webhook supported.                                | ''                    | an icon image URL string to use in place of the default icon.                                               |
| channel           | Only legacy incoming webhook supported.                                | ''                    | override the legacy integration's default channel. This should be an ID, such as `C8UJ12P4P`.               |

