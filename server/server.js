require('./config/config');

const _ = require('lodash');
const express = require('express');
/*
body-parser is a Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers
*/
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// ES6 destructuring
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

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
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;

  // validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      // if no doc, send 404
      return res.status(404).send();
    }

    // if doc, send doc back  with 200
    res.send({todo});
  }).catch((e) => {
    // 400 with empty body
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  // _.pick creates an object composed of the picked object properties.
  // we don't want the user to be able to update anything they choose.
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // new : true is equivalent to returnOriginal: false
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save().then((user) => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app}; // for test purpose
