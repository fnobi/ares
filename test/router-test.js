process.env.NODE_ENV = 'test';

var route  = require('../lib/ares/route'),
    assert = require('chai').assert;

route.access = function (path, callback) {
    var content = '';

    this.call(this, {
        path: path
    }, {
        status: function (code) {
            if ((code + '').match(/^[45]/)) {
                callback(code);
            }
        },
        send: function (data) {
            content += data;
        },
        end: function (data) {
            content += data || '';
            callback(null, content);
        }
    });
};

describe('route', function () {
    it('response html', function (done) {
        route.access('/index.html', function (err, content) {
            assert.ok(content);
            done();
        });
    });

    it('response index', function (done) {
        route.access('/', function (err, content) {
            assert.ok(content);
            done();
        });
    });
});