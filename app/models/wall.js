// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var wallSchema = mongoose.Schema({

user: String,
msg: String,
time: {type: Date, default: Date.now}

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Wall', wallSchema);
