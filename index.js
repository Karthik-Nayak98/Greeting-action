const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
     try {
       const github_token = core.getInput('GITHUB_TOKEN');
       const issue_message = core.getInput('issue_message');
       const PR_message = core.getInput('PR_message');
       const context = github.context;

       const event = github.context.eventName;
       let message;

       const octokit = new github.getOctokit(github_token);

       if (!issue_message || !PR_message) {
            core.warning('"message" input not found.');
            return;
        }

       // Checking for the type of event.
       if (event === 'pull_request') {
         message = PR_message;


       } else if (event === 'issues') {
         message = issue_message;

         let label = []
         label.push(octokit.issues.createLabel({
           name: 'proposal',
           description: 'New changes or updates proposed',
           color: 'BFD4F2', // this is a green color
         }));

         octokit.issues.addLabels({
           issue_number: context.issue.number,
           owner: context.repo.owner,
           repo: context.repo.repo,
           labels: label,
         });
       }

       //Creating a comment for PR or issue
       octokit.issues.createComment({
         issue_number: context.issue.number,
         owner: context.repo.owner,
         repo: context.repo.repo,
         body: message,
       });

       // Adding a default label to the issue.


      //  octokit.issues.addLabels({
      //    issue_number: context.issue.number,
      //    owner: context.repo.owner,
      //    repo: context.repo.repo,
      //    labels: proposed
      //  });
     } catch (error) {
       core.setFailed(error.message);
     }
}

run();
