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
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
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

var newTodo = new Todo({
  text: 'workout',
  completed: false,
  completedAt: 20171030
});

newTodo.save().then((doc) => {
  console.log(doc);
}, (err) => {
  console.log('Unable to save todo');
});
