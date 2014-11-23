var Client = require('../lib/client');

describe('pullrequests - api.github.com', function() {
    var client;
    before(function() {
        client = new Client();
        //client.authenticate('');
    });
    it('get', function(done) {
        client.getPullRequests('kuronekomichael/node-doit-im', function(err, content) {
            expect(err).is.not.ok;
            expect(content).is.ok;
            done();
        });
    });
});

describe('content - api.github.com', function() {
    var client;
    before(function() {
        client = new Client();
    });
    it('get', function(done) {
        client.getContent('kuronekomichael/node-doit-im', 'test/mocha.opts', function(err, content) {
            expect(err).is.not.ok;
            expect(content).is.ok;
            done();
        });
    });
});
