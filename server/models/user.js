const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: { // token type
      type: String,
      required: true
    },
    token: { // token value
      type: String,
      required: true
    }
  }]
});

// instance methods has access to the individual document
UserSchema.methods.toJSON = function () {
  var user = this;
  // taking mongoose variable (user) and converting it into a regular object
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  /*
  Arrow functions don't bind a 'this' keyword. We need 'this' for our methods
  because 'this' stores the individual document.
  */
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens.push({access, token});

  // save the data to database and return the token
  return user.save().then(() => {
    return token;
    /*
    this token will get passed as the success argument for the next then call.
    In the server file we can grab the token by tacking on a then callback
    getting access to the token and then responding inside of the callback function.
    */
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
