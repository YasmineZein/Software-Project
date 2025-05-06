const mongoose = require('mongoose');
const ExamSchema = mongoose.Schema({
    Questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    Name: {
        type: String,
        required:true
    },
    Private: {
        type: Boolean,
        required:true,
        default:false
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Exam',ExamSchema);