module.exports = function (env) {
    var config = {
        docRoot: 'public'
    };

    if (env == 'test') {
        config.docRoot = 'test/fixtures/public';
    }

    return config;
};