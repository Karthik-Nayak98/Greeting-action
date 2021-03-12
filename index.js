const core = require('@actions/core');
const github = require('@actions/github');

const github_token = core.getInput('GITHUB_TOKEN', { required: true });
const issue_msg = core.getInput('issue_message',{required:true});
const pr_msg = core.getInput('PR_message',{required:true});

const context = github.context;

async function run(){
    const event = github.context.eventName;
    var message;

    const octokit = github.getOctokit(github_token);

    // Checking for the type of event.
    if(event === 'pull_request'){
        message = pr_msg;
    }else if(event === 'issue'){
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
       color:['gray']
     });
}

run();