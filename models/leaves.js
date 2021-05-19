const mongoose = require('mongoose');
const { schema } = require('./user');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    reason: {
        type: String,
    },
    status: {
        type: String,
        default: 'Pending'
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    requestdate: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    days: {
        type: Number
    }

})

module.exports = mongoose.model('Leaves', LeaveSchema);