var express = require('express')
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello ' + (process.env.FOO || 'World') + '!')
})

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

if(process.env.MONGODB_URI){
  app.get('/mongo', function(request, response) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      if(err) throw err;

      var collection = db.collection('test_insert');
      collection.drop();
      collection.insert({'Foolish': 'Barometer'}, function(err, docs) {
        collection.find().toArray(function(err, results) {
          response.send(results[0]['Foolish']);
          db.close();
        });
      });

    })
  })
}

if(process.env.POSTGRES_URI){
  app.get('/postgres', function(request, response) {
    var pg = require('pg');

    pg.connect(process.env.POSTGRES_URI, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT $1::int AS number', ['1'], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        response.send(result.rows[0].number.toString());
        //output: 1
      });
    });
  });
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
