const mongoose = require('mongoose');
const CourseSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Sections:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],
    Img: {
        type: String,
        required:true
    },
    Private: {
        type: Boolean,
        required:true
    },
    Price: {
        type: Number,
        required:true
    },
    Isfree:  {
        type: Boolean,
        default: false
    },
    Instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Instructor"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('Course',CourseSchema);