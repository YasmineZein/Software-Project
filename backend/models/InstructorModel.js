const mongoose = require('mongoose');
const InstructorSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Img: {
        type: String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Instructor',InstructorSchema);