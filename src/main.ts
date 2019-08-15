import * as core from '@actions/core';
import { Send } from './slack';

async function run() {
  try {
    const text = core.getInput('text');
    const author_name = core.getInput('attachment.author_name') || '';
    const fallback = core.getInput('attachment.fallback') || '';
    const color = core.getInput('attachment.color') || '';
    const title = core.getInput('attachment.title') || '';
    const attachmentText = core.getInput('attachment.text') || '';

    const title1 = core.getInput('attachment.field.title1') || '';
    const value1 = core.getInput('attachment.field.value1') || '';
    const short1 =
      core.getInput('attachment.field.short1') === 'true' ? true : false;
    const title2 = core.getInput('attachment.field.title2') || '';
    const value2 = core.getInput('attachment.field.value2') || '';
    const short2 =
      core.getInput('attachment.field.short2') === 'true' ? true : false;
    const title3 = core.getInput('attachment.field.title3') || '';
    const value3 = core.getInput('attachment.field.value3') || '';
    const short3 =
      core.getInput('attachment.field.short3') === 'true' ? true : false;
    const title4 = core.getInput('attachment.field.title4') || '';
    const value4 = core.getInput('attachment.field.value4') || '';
    const short4 =
      core.getInput('attachment.field.short4') === 'true' ? true : false;
    await Send({
      text: text,
      attachments: [
        {
          author_name,
          fallback,
          color,
          title,
          text: attachmentText,
          fields: [
            { title: title1, value: value1, short: short1 },
            { title: title2, value: value2, short: short2 },
            { title: title3, value: value3, short: short3 },
            { title: title4, value: value4, short: short4 },
          ],
        },
      ],
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
