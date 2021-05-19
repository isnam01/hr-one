const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    salutation: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    manager:
    {
        type: Schema.Types.ObjectId || String,
        ref: 'User'
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    doj: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String
    },
    expiretoken: {
        type: Date
    },
    resettoken: {
        type: String
    },
    leave: {
        birthday: {
            type: Number,
            default: 0,
        },
        normal: {
            type: Number,
            default: 0,
        },
        extra: {
            type: Number,
            default: 0,
        }

    }

});


module.exports = mongoose.model('User', UserSchema);