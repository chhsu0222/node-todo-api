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
body-parser is going to take your JSON (on the client side) and convert
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

app.get('/todos', (req, res) => {
  // to fetch everything in todo collection.
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app}; // for test purpose
