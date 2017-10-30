

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // findOneAndUpdate would get that document and back in the response.
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59f6868afcaab525242dc64c')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59f2f73642114011888f11ab')
  }, {
    $set: {name: 'Garfield'},
    $inc: {age: 4}
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  //db.close(); // Close the connection with the MongoDB server.
});
