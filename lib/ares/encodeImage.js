var fs   = require('fs'),
    mime = require('mime');

var encodeImage = function (filePath, callback) {
    var type = mime.lookup(filePath);
    var data_uri_prefix = "data:" + type + ";base64,";

    fs.readFile(filePath, function (err, data) {
        if (err) {
            callback(err);
        }

        // var buf = new Buffer(body);
        var buf = data;
        var image = buf.toString('base64');

        return callback(null, data_uri_prefix + image);
    });
};

module.exports = encodeImage;