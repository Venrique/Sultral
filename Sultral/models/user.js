const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    names: {type: String, required: true},
    lastnames: {type: String, required: true},
    birthdate: {type: Date, required: true},
    gender: {type: String, required: true},
    pass: {type: String, required: true},
    contactos: {type: [mongoose.Schema.Types.ObjectId]},
    storage: {type: mongoose.Schema.Types.Number, required: true},
    maxstorage: {type: mongoose.Schema.Types.Number, required: true}
});

module.exports = mongoose.model('Usuario',userSchema);