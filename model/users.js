const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating schema 

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model("users", UserSchema);