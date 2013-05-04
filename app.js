var WebSocketServer = require('ws').Server,
    express         = require('express'),
    http            = require('http'),
    path            = require('path'),
    ares            = require(__dirname + '/lib/ares');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(ares.route);

var server = http.createServer(app);
var wss = new WebSocketServer({
    server: server
});

var connections = [];

wss.on('connection', function (ws) {
    connections.push(ws);
    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });
    ws.on('message', function (message) {
        var param = JSON.parse(message);
        var resource = new ares.Resource(param);
        resource.read(function (err, res) {
            param.data = res;
            ws.send(JSON.stringify(param));
        });
    });
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});