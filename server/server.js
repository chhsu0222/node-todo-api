var mongoose = require('mongoose');

// tell mongoose which Promise library we want to use.
mongoose.Promise = global.Promise;
/*
mongoose is going to be waiting for that connection before it
ever actually tries to make the query.
*/
mongoose.connect('mongodb://localhost:27017/TodoApp');

/*
create a model (constructor function)
Specify the attributes we want todo to have.
*/
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// create a new 'Todo' instance
// var newTodo = new Todo({
//   text: 'Cook dinner'
// });

// save it to database. Save returns a Promise.
// newTodo.save().then((doc) => {
//   console.log('Save todo', doc);
// }, (err) => {
//   console.log('Unable to save todo');
// });

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

var newUser = new User({
  email: '   ch2@example.com'
});

newUser.save().then((doc) => {
  console.log(doc);
}, (err) => {
  console.log('Unable to save todo', err);
});
