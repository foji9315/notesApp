var mongoose = require('mongoose');
var notesSchema = new  mongoose.Schema({
    title: String,
    created: Date, 
    body: String,
    status: {
        type: Boolean,
        default: false
    },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Note", notesSchema);