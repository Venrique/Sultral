const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: String,
    email: String,
    pass: String
});

module.exports = mongoose.model('Usuario',userSchema);