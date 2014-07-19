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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
