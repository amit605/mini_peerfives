const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    points: {
        type: Number,
    },
    given_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    given_to:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    created_on: { 
        type: Date
    },
    updated_on: {
        type: Date
    }
})

module.exports = mongoose.model('rewardHistory', rewardSchema);
