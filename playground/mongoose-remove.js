const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// findOneAndRemove and findByIdAndRemove will return the document as well
// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findByIdAndRemove('59fac7a60488bf3df4991f4e').then((todo) => {
  console.log(todo);
});
