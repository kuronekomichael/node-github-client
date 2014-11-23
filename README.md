node-github-client
==================

[![NPM version][npm-badge]](http://badge.fury.io/js/doit-im)
[![Build status][travis-badge]](https://travis-ci.org/kuronekomichael/node-github-client)
[npm-badge]: https://badge.fury.io/js/doit-im.png
[travis-badge]: https://travis-ci.org/kuronekomichael/node-github-client.png?branch=master

github api for node.js

## Features

- authenticate via oauth token
- get pull requests (all pages!)
- get comments (all pages!)

## Getting Started

```
npm install node-github-client
```

### example:

```
var GithubClient = require('node-github-client');
var client = new GithubClient();

client.authenticate('<github-username>', '<githu-personal-token>');

client.getPullRequests('organization/repo-name', function(err, listOfPulls) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(listOfPulls));
});
```
