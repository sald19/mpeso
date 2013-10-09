var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app);


app.configure(function() {
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(app.router);

    app.use(function(req, res){
        res.status(404).send('404', { error: '404' });
    });
});


app.get('/api', function (req, res) {
    res.send('API is running');
});

// start server

server.listen(8888, function () {
    console.log('server running on port: 8888');
});