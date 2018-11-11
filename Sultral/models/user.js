const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    pass: {type: String, required: true}
});

module.exports = mongoose.model('Usuario',userSchema);