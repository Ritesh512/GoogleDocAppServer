const mongoose = require("mongoose");
const Document = new mongoose.Schema({
    _id:String,
    data:Object
});


module.exports = mongoose.model("documents", Document);

// mongodb+srv://riteshprajapati1359:<password>@cluster0.40tfumc.mongodb.net/?retryWrites=true&w=majority