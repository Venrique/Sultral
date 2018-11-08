var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');


router.get('/', function(req, res, next) {
    res.render('Registrar', { title: 'Sultral - Registrarse' });
});

router.post('/', function(req,res,next) {
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.usuario,
        email: req.body.correo,
        pass: req.body.contrasenia
    });

    usuario.save().then(result => {
        console.log(result);

        res.status(201).json({
            message: "Se creo el usuario",
            createdUser: usuario
        });

    }).catch(err => console.log(err));
});

module.exports = router;