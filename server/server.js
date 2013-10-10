var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , mongoose = require('mongoose')
    , request = require('request')
    , models = require('../db/models');

mongoose.connect('mongodb://localhost/mpeso');

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

function verifie (req, res, next) {
    var id = req.params.id
        , regex = /[0-9]{8}/;

    if (id.match(regex)) {
        return next();
    }

    next(false);
}

function saveRecord (doc, balance) {
    var spending = doc.record[0].balance - balance;

    new models.Record({
        balance: parseFloat(balance),
        spending:  parseFloat(spending)
    }).save(function (err, rec) {
        doc.record.push(rec);
        doc.save(function (err) {});
    });
}

function queryMpeso (tuc, callback) {
    request({
        method: 'POST',
        uri: 'http://mpeso.net/datos/consulta.php',
        form: {
            _funcion: '1',
            _terminal: tuc
        }
    }, function (err, res, body) {
            body = JSON.parse(body);
            var str = body.Mensaje;

            result = str.match(/\d+\.\d+/gi);
            return callback(result[0]);
        }
    );
}

app.get('/api/:id', verifie, function (req, res) {
    var id = req.params.id;


    return queryMpeso(id, function (balance) {
        models.Card
        .findOne({ tuc: id })
        .populate({
            options: {
                sort: {
                    date: -1
                },
                limit: 1
            },
            path: 'record',
            select: 'balance'
        })
        .exec(function (err, doc) {
            if (doc) {
                saveRecord(doc, balance);    
            } else {
                new models.Card({
                    tuc: id
                }).save(function (err, doc) {
                    saveRecord(doc, balance);
                });
            }     
        });
    });


    models.Card
    .findOne({
        tuc: id
    })
    .populate({
        options: {
            sort: {
                date: -1
            },
            limit: 1
        },
        path: 'record',
        select: 'balance'
    })
    .exec(function (err, data) {
        console.log(data);
        res.send('API is running - ' + data.tuc);
    });

});

// start server

server.listen(8888, function () {
    console.log('server running on port: 8888');
});