const mongoose = require('mongoose');
const ExamDoneSchema = mongoose.Schema({
    User:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
       },
    Result: {
        type: String,
        required:true
    },
    Total: {
        type: String,
        required:true
    },
    Exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('ExamDone',ExamDoneSchema);