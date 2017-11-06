const mongoose = require('mongoose');
const validator = require('validator');

// {
//   email: 'ch@example.com',
//   password: 'asmfdoamenjfiewb',
//   tokens: [{
//     access: 'auth',
//     token: 'asdkiahjuerbnqcbnmahxco'
//   }]
// }
// We're never going to let users manually update the tokens array


var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail, // return true if it's valid or false if it'd invalid
      /*
      same as:
      (value) => {
        return validator.isEmail(value);
      }
      */
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

module.exports = {User};
