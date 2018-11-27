const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const elementSchema = new Schema({
    _id: new mongoose.Schema.Types.ObjectId,
    nombre: {type: String, required: true},
    ext: {type: String},
    contenedor: {type: mongoose.Schema.Types.ObjectId},
    contenido: {type: [mongoose.Schema.Types.ObjectId]},
    creador: {type: mongoose.Schema.Types.ObjectId, required: true},
    compartido: {type: [mongoose.Schema.Types.ObjectId]},
});

module.exports = mongoose.model('Elemento',elementSchema);