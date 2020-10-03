module.exports = async () => {
  process.env.GITHUB_REPOSITORY = '8398a7/action-slack';
  process.env.GITHUB_WORKFLOW = 'PR Checks';
  process.env.GITHUB_SHA = 'b24f03a32e093fe8d55e23cfd0bb314069633b2f';
  process.env.GITHUB_REF = 'refs/heads/feature/19';
  process.env.GITHUB_EVENT_NAME = 'push';
  process.env.GITHUB_RUN_ID = '1';
  process.env.GITHUB_JOB = 'notification';
};
