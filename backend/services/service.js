const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const url = process.env.DB_URL

/** connect to MongoDB datastore */
try {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("Db connected")
    })    
} catch (error) {
    console.log(error)
}

module.exports = {
    user: require('../model/user_model'),
    reward: require('../model/reward_history_model'),
};
