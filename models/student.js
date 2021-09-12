const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    meeting_time: {
        type: String,
    }


});
var Students = mongoose.model('student', studentSchema);
module.exports = {
    Students,
    studentSchema
};