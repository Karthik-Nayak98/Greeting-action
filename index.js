const core = require('@actions/core');
const github = require('@actions/github');

const github_token = core.getInput('GITHUB_TOKEN', { required: true });
const issue_msg = core.getInput('issue_message',{required:false});
const pr_msg = core.getInput('PR_message',{required:false});

const context = github.context;

async function run(){
    try{
        const event = github.context.eventName;
        var message;

        const octokit = github.getOctokit(github_token);

        // Checking for the type of event.
        if (event === 'pull_request') {
            message = "# :partying_face: Congratulations :tada:\
            :pray: Thank you @${{github.actor}} for taking our your time and contributing to our project. Our team will now review this and if everything looks fine it will be merged";
        } else if (event === 'issue') {
            message = "Hello @${{github.actor}}, Thank you opening an issue.";
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
    }
    catch(error){
        core.setFailed(error.message)
    }

}

run();