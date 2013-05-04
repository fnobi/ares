var fs     = require('fs'),
    reduce = require('./reduce'),
    config = require('./config')(process.env.NODE_ENV);

var route = function (req, res, next) {
    var docRoot = config.docRoot;
    var reqPath = req.path;

    if (reqPath.match(/\/$/)) {
        reqPath += 'index.html';
    }

    if (!reqPath.match(/\.html$/)) {
        res.status(404);
        res.end();
        return;
    }

    fs.readFile(docRoot + reqPath, 'utf8', function (err, body) {
        if (err) {
            return next(err);
        }
        reduce(body, function (err, result) {
            if (err) {
                return next(err);
            }

            res.send(result);
            res.end();
        });
    });
};

module.exports = route;