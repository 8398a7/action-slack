import { context } from '@actions/github';
import { Octokit } from './client';

export interface Field {
  title: string;
  value: string;
  short: boolean;
}

export class FieldFactory {
  private octokit?: Octokit;
  private fields: string[];
  private jobName: string;

  constructor(fields: string, jobName: string, octokit?: Octokit) {
    this.fields = fields.replace(/ /g, '').split(',');
    this.jobName = jobName;
    this.octokit = octokit;
  }

  includes(field: string) {
    return this.fields.includes(field) || this.fields.includes('all');
  }

  filterField<T extends Array<Field | undefined>, U extends undefined>(
    array: T,
    diff: U,
  ) {
    return array.filter(item => item !== diff) as Exclude<
      T extends { [K in keyof T]: infer U } ? U : never,
      U
    >[];
  }

  async attachments(): Promise<Field[]> {
    return this.filterField(
      [
        this.includes('repo')
          ? createAttachment('repo', await this.repo())
          : undefined,
        this.includes('message')
          ? createAttachment('message', await this.message())
          : undefined,
        this.includes('commit')
          ? createAttachment('commit', await this.commit())
          : undefined,
        this.includes('author')
          ? createAttachment('author', await this.author())
          : undefined,
        this.includes('authorName')
          ? createAttachment('authorName', await this.authorName())
          : undefined,
        this.includes('action')
          ? createAttachment('action', await this.action())
          : undefined,
        this.includes('job')
          ? createAttachment('job', await this.job())
          : undefined,
        this.includes('took')
          ? createAttachment('took', await this.took())
          : undefined,
        this.includes('eventName')
          ? createAttachment('eventName', await this.eventName())
          : undefined,
        this.includes('ref')
          ? createAttachment('ref', await this.ref())
          : undefined,
        this.includes('branch')
          ? createAttachment('branch', await this.branch())
          : undefined,
        this.includes('workflow')
          ? createAttachment('workflow', await this.workflow())
          : undefined,
      ],
      undefined,
    );
  }

  private async message(): Promise<string> {
    if (this.octokit === undefined) {
      process.env.AS_MESSAGE = this.githubTokenIsNotSet;
      return this.githubTokenIsNotSet;
    }

    const resp = await this.getCommit(this.octokit);

    const value = `<${resp.data.html_url}|${
      resp.data.commit.message.split('\n')[0]
    }>`;
    process.env.AS_MESSAGE = value;
    return value;
  }

  private async author(): Promise<string> {
    if (this.octokit === undefined) {
      process.env.AS_AUTHOR = this.githubTokenIsNotSet;
      return this.githubTokenIsNotSet;
    }

    const resp = await this.getCommit(this.octokit);
    const author = resp.data.commit.author;

    const value = `${author.name}<${author.email}>`;
    process.env.AS_AUTHOR = value;
    return value;
  }

  private async authorName(): Promise<string> {
    if (this.octokit === undefined) {
      process.env.AS_AUTHOR_NAME = this.githubTokenIsNotSet;
      return this.githubTokenIsNotSet;
    }

    const resp = await this.getCommit(this.octokit);
    const author = resp.data.commit.author;

    const value = `${author.name}`;
    process.env.AS_AUTHOR_NAME = value;
    return value;
  }

  private async took(): Promise<string> {
    if (this.octokit === undefined) {
      process.env.AS_JOB = this.githubTokenIsNotSet;
      return this.githubTokenIsNotSet;
    }

    const resp = await this.octokit?.actions.listJobsForWorkflowRun({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: context.runId,
    });
    const currentJob = resp?.data.jobs.find(job => job.name === this.jobName);
    if (currentJob === undefined) {
      process.env.AS_JOB = this.jobIsNotFound;
      return this.jobIsNotFound;
    }

    let time = new Date().getTime() - new Date(currentJob.started_at).getTime();
    const h = Math.floor(time / (1000 * 60 * 60));
    time -= h * 1000 * 60 * 60;
    const m = Math.floor(time / (1000 * 60));
    time -= m * 1000 * 60;
    const s = Math.floor(time / 1000);

    let value = '';
    if (h > 0) {
      value += `${h} hour `;
    }
    if (m > 0) {
      value += `${m} min `;
    }
    if (s > 0) {
      value += `${s} sec`;
    }
    process.env.AS_TOOK = value;

    return value;
  }

  private async job(): Promise<string> {
    if (this.octokit === undefined) {
      process.env.AS_JOB = this.githubTokenIsNotSet;
      return this.githubTokenIsNotSet;
    }

    const { owner } = context.repo;
    const resp = await this.octokit?.actions.listJobsForWorkflowRun({
      owner,
      repo: context.repo.repo,
      run_id: context.runId,
    });
    const currentJob = resp?.data.jobs.find(job => job.name === this.jobName);
    if (currentJob === undefined) {
      process.env.AS_JOB = this.jobIsNotFound;
      return this.jobIsNotFound;
    }

    const jobId = currentJob.id;
    const value = `<https://github.com/${owner}/${context.repo.repo}/runs/${jobId}|${this.jobName}>`;
    process.env.AS_JOB = value;

    return value;
  }

  private async commit(): Promise<string> {
    const { sha } = context;
    const { owner, repo } = context.repo;

    const value = `<https://github.com/${owner}/${repo}/commit/${sha}|${sha.slice(
      0,
      8,
    )}>`;
    process.env.AS_COMMIT = value;
    return value;
  }

  private async repo(): Promise<string> {
    const { owner, repo } = context.repo;

    const value = `<https://github.com/${owner}/${repo}|${owner}/${repo}>`;
    process.env.AS_REPO = value;
    return value;
  }

  private async eventName(): Promise<string> {
    const value = context.eventName;
    process.env.AS_EVENT_NAME = value;
    return value;
  }

  private async ref(): Promise<string> {
    const value = context.ref;
    process.env.AS_REF = value;
    return value;
  }

  private async branch(): Promise<string> {
    const value = context.ref.slice(context.ref.lastIndexOf('/') + 1);
    process.env.AS_BRANCH = value;
    return value;
  }

  private async workflow(): Promise<string> {
    const sha = context.payload.pull_request?.head.sha ?? context.sha;
    const { owner, repo } = context.repo;

    const value = `<https://github.com/${owner}/${repo}/commit/${sha}/checks|${context.workflow}>`;
    process.env.AS_WORKFLOW = value;
    return value;
  }

  private async action(): Promise<string> {
    const sha = context.payload.pull_request?.head.sha ?? context.sha;
    const { owner, repo } = context.repo;

    const value = `<https://github.com/${owner}/${repo}/commit/${sha}/checks|action>`;
    process.env.AS_ACTION = value;
    return value;
  }

  private async getCommit(octokit: Octokit) {
    const { owner, repo } = context.repo;
    const { sha: ref } = context;
    return await octokit.repos.getCommit({ owner, repo, ref });
  }

  private get githubTokenIsNotSet() {
    return 'GitHub Token is not set.';
  }

  private get jobIsNotFound() {
    return 'Job is not found.\nCheck the matrix.';
  }
}

function createAttachment(
  title: string,
  value: string,
  short?: boolean,
): Field | undefined {
  if (short === undefined) short = true;
  return { title, value, short };
}
