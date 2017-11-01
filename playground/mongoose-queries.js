const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59f83db508826622780ee4cc1';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   // mongoose will take that string and convert it to an ObjectID
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   // only returns one document (object)
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     // use return to prevent the rest ofthe function from executing
//     return console.log('Id not found');
//   }
//   // only returns one document (object)
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

var userId = '59f6ed979b32e00438dcd3c3';

User.findById(userId).then((user) => {
  if (!user) {
    return console.log('User Id not found');
  }
  console.log('User By Id:', JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log('Invalid User ID', e);
});
