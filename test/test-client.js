var Client = require('../lib/client');

describe('api.github.com', function() {
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
