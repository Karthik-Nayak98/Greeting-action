const core = require('@actions/core');
const github = require('@actions/github');

async function run(){
     try {
       const github_token = core.getInput('GITHUB_TOKEN');
       const issue_message = core.getInput('issue_message');
       const PR_message = core.getInput('PR_message');
       const context = github.context;

       const event = github.context.eventName;
       let message;

       const octokit = new github.getOctokit(github_token);

        if (!issue_msg || !pr_msg) {
            core.setFailed('"message" input not found.');
            return;
        }

       // Checking for the type of event.
       if (event === 'pull_request') {
         message = PR_message;
       } else if (event === 'issues') {
         message = issue_message;
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
