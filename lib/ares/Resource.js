var fs          = require('fs'),
    encodeImage = require('./encodeImage');

var Resource = function (element) {
    this.element = element;
    this.filePath = 'public' + (element.src || element.href);
};

Resource.prototype.read = function (callback) {
    fs.exists(this.filePath, function (exists) {
        if (!exists) {
            return callback('not found');
        }
        if (this.element.tagName == 'img') {
            return encodeImage(this.filePath, callback);
        }

        fs.readFile(this.filePath, 'utf8', callback);
    }.bind(this));
};

module.exports = Resource;