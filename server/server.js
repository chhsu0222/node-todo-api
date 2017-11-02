var express = require('express');
/*
body-parser is a Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers
*/
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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

// GET /todos/1234
/*
:id (colon followed by a name) is a URL parameter.
It will create an 'id' variable on the req object.
*/
app.get('/todos/:id', (req, res) => {
  /*
  req.params will be an object having key value pairs.
  Where the key is the URL parameter (e.g. {id: '1234'}).
  */
  var id = req.params.id;

  // Valid id using isValid
  if (!ObjectID.isValid(id)) {
    // 404 - send back empty body
    console.log('Invalid Id');
    return res.status(404).send();
  }

  // findById
  Todo.findById(id).then((todo) => {
    // success
    if (!todo) {
      // if no todo - send back 404 with empty body
      console.log('Id not found');
      return res.status(404).send();
    }
    // if todo - send it back
    res.send({todo});
  }, (e) => {
    // error
    console.log('Can\'t fetch todos');
    // 400 - and send empty body back
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app}; // for test purpose
