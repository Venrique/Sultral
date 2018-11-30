const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const elementSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {type: String, required: true},
    ext: {type: String},
    peso: {type: mongoose.Schema.Types.Number},
    contenedor: {type: mongoose.Schema.Types.ObjectId},
    contenido: {type: [mongoose.Schema.Types.ObjectId]},
    creador: {type: mongoose.Schema.Types.ObjectId, required: true},
    compartido: {type: [mongoose.Schema.Types.ObjectId]},
    contprevio: {type: mongoose.Schema.Types.ObjectId}
});

module.exports = mongoose.model('Elemento',elementSchema);