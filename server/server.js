var express = require('express');
/*
body-parser is a Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers
*/
var bodyParser = require('body-parser');

// ES6 destructuring
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

/*
body-parser is going to take your JSON and convert
it into an object attaching it onto 'req' object.
*/
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });

});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
