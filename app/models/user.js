// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        userName     : String,
        age          : String,
        gender       : String,
        usertype     : String,
        password     : String,
        roles         : Array,
        friends : Array,
        bio : String,
        religion : String,
        profile_picture : String,
        ethnicity : String,
        current_location : String,
        place_of_birth : String,
        hobbies: String
    }

});



// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
