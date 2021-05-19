const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    checkin: {
        type: String
    },
    checkout: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    iscorrection: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('Attendance', AttendanceSchema);