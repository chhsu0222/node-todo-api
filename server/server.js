require('./config/config');

const _ = require('lodash');
const express = require('express');
const path = require('path');
/*
body-parser is a Node.js body parsing middleware.
Parse incoming request bodies in a middleware before your handlers
*/
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');
const multer = require('multer');
//const upload = multer({dest: 'uploads/'});

// ES6 destructuring
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

const uploadPath = path.join(__dirname, '..', '/tmp/my-uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage});

/*
body-parser is going to take your JSON (on the client side) and convert
it into an object attaching it onto 'req' object.
*/
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });

});

app.get('/todos', authenticate, (req, res) => {
  // to fetch everything belong to the user in todo collection.
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
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
app.get('/todos/:id', authenticate, (req, res) => {
  /*
  req.params will be an object having key value pairs.
  Where the key is the URL parameter (e.g. {id: '1234'}).
  */
  var id = req.params.id;

  // Valid id using isValid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});

  } catch (e) {
    res.status(400).send();
  }
  /*
  // get the id
  var id = req.params.id;
  // validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // remove todo by id
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
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
  */
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
  /*
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken(); // We're expecting a chaining Promise.
  }).then((token) => {
    // The argument 'token' is passed by 'return token' in user.generateAuthToken()
    // the user object down below was already updated (tokens)
    res.header('x-auth', token).send(user); // header('key', value)
    // 'x-' means it's not mecessarily a header that HTTP supports by default a custom header.
  }).catch((e) => {
    res.status(400).send(e);
  });
  */
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {

  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }

  /*
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    // use return so if there is anything wrong, the catch can handle it.
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
  */
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  // req.user & req.token will be updated in authenticate middleware
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
  /*
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
  */
});

app.post('/img/upload', upload.single('img'), (req, res) => {
  //console.log(req);
  console.log(req.body);
  if (req.file) {
    console.log(`${req.file.originalname} uploaded!!!`);
    res.status(200).send();
  } else {
    console.log('no file uploaded');
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app}; // for test purpose
