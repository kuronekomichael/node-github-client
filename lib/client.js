'use strict';
var urljoin = require('url-join');
var request = require('request');

function GitHubAPI(host) {
    this.host = host || 'https://api.github.com';
    if (!/api\.github\.com/.test(this.host) && !/api\/v3\/?$/.test(this.host)) {
        this.host = urljoin(host, 'api/v3');
    }
    this.headers = {
        'User-Agent': 'node-github-client/0.0.1'
    };
}

GitHubAPI.prototype.authenticate = function(user, token) {
    this.auth = {
        'user': user,
        'pass': token
    };
    return this;
}

GitHubAPI.prototype.getPullRequests = function(repoName, cb) {
    //this.getPullRequestsWithStatus(repoName, 'all', cb);  <- cannot use 'all' on our GHE...
    var that = this;
    var pulls = [];
    that.getPullRequestsWithStatus(repoName, 'open', function(err, openPulls) {
        if (err) {
            cb(err)
            return;
        }
        Array.prototype.push.apply(pulls, openPulls);
        that.getPullRequestsWithStatus(repoName, 'closed', function(err, closedPulls) {
            if (err) {
                cb(err)
                return;
            }
            Array.prototype.push.apply(pulls, closedPulls);
            cb(err, pulls);
        });
    });
};


GitHubAPI.prototype.getPullRequestsWithStatus = function(repoName, status, cb) {
    var that = this;
    var prUrl = urljoin(that.host, '/repos/', repoName, '/pulls');

    var pulls = [];
    function getPulls(page) {
        request.get({
            url: prUrl,
            qs: {
                page: page,
                per_page: 100,
                state: status
            },
            auth: that.auth,
            headers: that.headers
        }, function(err, res, doc) {
            if (err) {
                cb(err);
                return;
            }
            Array.prototype.push.apply(pulls, JSON.parse(doc.toString()));

            var link = res.headers.link;
            if (!link) {
                cb(null, pulls);
                return;
            }
            var matched = link.split(',')[1].match(/\?page=(\d+)&/);
            if (!matched) {
                cb(new Error(matched));
                return;
            }
            var lastPageNum = parseInt(matched[1], 10);
            if (page < lastPageNum) {
                process.nextTick(function() {
                    getPulls(page + 1);
                });
            } else {
                cb(null, pulls);
            }
        });
    }

    getPulls(1);
};

GitHubAPI.prototype.getComments = function(commentUrl, cb) {
    var that = this;

    var comments = [];
    function getComments(page) {
        request.get({
            url: commentUrl,
            qs: {
                page: page,
                per_page: 100
            },
            auth: that.auth,
            headers: that.headers
        }, function(err, res, doc) {
            if (err) {
                cb(err);
                return;
            }
            Array.prototype.push.apply(comments, JSON.parse(doc.toString()));

            var link = res.headers.link;
            if (!link) {
                cb(null, comments);
                return;
            }
            var matched = link.split(',')[1].match(/\?page=(\d+)&/);
            if (!matched) {
                cb(new Error(matched));
                return;
            }
            var lastPageNum = parseInt(matched[1], 10);
            if (page < lastPageNum) {
                process.nextTick(function() {
                    getComments(page + 1);
                });
            } else {
                cb(null, comments);
            }
        });
    }

    getComments(1);
};

GitHubAPI.prototype.getContent = function(repoName, path, cb) {
    var contentUrl = urljoin(this.host, '/repos/', repoName, '/contents/', path);
    var queryString = this.auth ? { access_token: this.auth.pass } : null;

    request.get({
        url: contentUrl,
        qs: queryString,
        headers: this.headers
    }, function(err, res, doc) {
        if (err) {
            cb(err);
            return;
        }
        if (res.statusCode !== 200) {
            cb(new Error('invalid http status:' + res.statusCode));
            return;
        }
        var contentData = JSON.parse(doc.toString());
        var content = new Buffer(contentData.content, 'base64').toString();
        cb(null, content);
    });
};

module.exports = GitHubAPI;
