var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user_name: {
        type: String,
    },
    created_on: { 
        type: Date
    },
    updated_on: {
        type: Date
    }
})

module.exports = mongoose.model('users', userSchema);
