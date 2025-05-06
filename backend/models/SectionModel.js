const mongoose = require('mongoose');
const SectionSchema = mongoose.Schema({
    Name: {
        type: String,
        required:true
    },
    Blocks:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Block"
    }]
},
{
    timestamps:true
});

module.exports = mongoose.model('Section',SectionSchema);