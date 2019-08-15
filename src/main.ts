import * as core from '@actions/core';
import { Send } from './slack';

async function run() {
  try {
    const text = core.getInput('text');
    const attachmentColor = core.getInput('attachment.color');
    const attachmentTitle = core.getInput('attachment.title');
    await Send({
      text: text,
      attachments: [
        {
          color: attachmentColor || '',
          title: attachmentTitle || '',
        },
      ],
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
