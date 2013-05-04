var jsdom = require('jsdom'),
    ejs   = require('ejs'),
    fs    = require('fs');

var JQUERY_URL = __dirname + '/../../js/jquery-2.0.0.min.js';
var template = fs.readFileSync('templates/ares.js.ejs', 'utf8');

var reduce = function (html, callback) {
    jsdom.env(html, [JQUERY_URL], function (err, window) {
        if (err) {
            return callback(err);
        }

        var $ = window.$;
        var resources = [];

        $('script[src="' + JQUERY_URL + '"]:last').remove();

        $('img,script,link').each(function () {
            var $elem = $(this);
            var id = 'ares_resource_' + (resources.length + 1);
            var tagName = $elem[0].tagName.toLowerCase();
            var prop = tagName == 'link' ? 'href' : 'src';

            if (!$elem.attr(prop)) {
                return;
            }
            if ($elem.attr(prop).match(/^http/)) {
                return;
            }
            if (tagName == 'link' && $elem.attr('rel') != 'stylesheet') {
                return;
            }

            $elem.attr('id', id);

            var resource = {
                id: id,
                tagName: tagName
            };
            resource[prop] = $elem.attr(prop);
            resources.push(resource);
            $elem.removeAttr(prop);
        });

        $('body').append([
            '<script>',
            ejs.render(template, {
                resources: JSON.stringify(resources)
            }),
            '</script>'
        ].join(''));

        var document = window.document;
        callback(null, (
            document._doctype ? document._doctype._fullDT + '\n' : ''
        ) + document.outerHTML);
    });
};

module.exports = reduce;