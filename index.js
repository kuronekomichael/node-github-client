var GithubClient = require('./lib/client');
var client = new GithubClient();

client.authenticate('<github-username>', '<githu-personal-token>');

client.getPullRequests('organization/repo-name', function(err, listOfPulls) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(listOfPulls));
});
