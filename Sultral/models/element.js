const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const elementSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {type: String, required: true},
    ext: {type: String},
    contenedor: {type: String},
    contenido: {type: [String]},
    creador: {type: String, required: true},
    compartido: {type: [String]},
});

module.exports = mongoose.model('Elemento',elementSchema);