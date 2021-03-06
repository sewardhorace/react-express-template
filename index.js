var path = require('path');
var express = require('express');

var app = express();

app.use('/static', express.static(__dirname + '/src/dist'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('app listening at http://localhost:3000');
});
