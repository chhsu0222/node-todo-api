
/*
Object destructuring lets you pull out properties from an object
creating variables. (ES6 feature)

e.g.
var user = {name: 'CH', age: 30};
var {name} = user;
console.log(name); // CH
*/
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
// ObjectID constructor function

var obj = new ObjectID();
console.log(obj);

/*
In Mongodb, you don't have to create a database before you start using it.
MongoDB is not going to create the database until we start adding
data into it.
*/
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    // Add return to prevent the rest of the function from executing
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // create a collection and insert one document
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }

    // the ops attribute is going to store all of the documents that were inserted.
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // Insert new doc into Users collection (name, age, location)

  // db.collection('Users').insertOne({
  //   name: 'CH',
  //   age: 30,
  //   location: 'Taipei'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert Users', err);
  //   }
  //
  //   //console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  db.close(); // Close the connection with the MongoDB server.
});
