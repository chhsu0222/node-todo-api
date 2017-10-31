// we don't need to require mocha and nodemon
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

/*
beforeEach will let us run some code before every single test,
and it's only going to move on to the test case once we called 'done'.
Which means we can do something asynchronous inside of the function.
*/

// default todos
const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

// e.g. empty the database
beforeEach((done) => {
  // remove({}) will wipe all of our todos.
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); // return a Promise so we can chain callbacks
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})//send data. This object will be converted to JSON by supertest
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          // This err will handle any errors that might have occurred up above.
          return done(err);
        }
        /*
        To check what got stored in the MongoDB collection.
        Make a request to the database fetching all the todos and
        verifying that are one todo was indeed added.
        */

        // Todo.find() is similar to the MongoDB native find method.
        // we can call it with no arguments to fetch everything in that collection.
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1); // assume there's nothing already in the database
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  /*
  The beforeEach will run before every single test case.
  Which means the todo added in the last test case would be deleted
  before the following test case runs.
  */
  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
