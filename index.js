const core = require('@actions/core');
const github = require('@actions/github');

async function run(){
     try {
       const github_token = core.getInput('GITHUB_TOKEN');
       const issue_msg = core.getInput('issue_message');
       const pr_msg = core.getInput('PR_message');
       const context = github.context;

       const event = github.context.eventName;
       var message;

       const octokit = github.getOctokit(github_token);

       // Checking for the type of event.
       if (event === 'pull_request') {
         message = pr_msg;
       } else if (event === 'issues') {
         message = issue_msg;
       }

       //Creating a comment for PR or issue
       octokit.issues.createComment({
         issue_number: context.issue.number,
         owner: context.repo.owner,
         repo: context.repo.repo,
         body: message,
       });

       // Adding a default label to the issue.
       github.issues.addLabels({
         issue_number: context.issue.number,
         owner: context.repo.owner,
         repo: context.repo.repo,
         labels: ['Proposed'],
         color: ['gray'],
       });
     } catch (error) {
       core.setFailed(error.message);
     }
}

run();