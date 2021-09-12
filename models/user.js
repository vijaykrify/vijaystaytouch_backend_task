const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    token: {
        type: String
    }


});
var Users = mongoose.model('user', studentSchema);
module.exports = {
    Users,
    studentSchema
};