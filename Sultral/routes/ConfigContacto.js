var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
  res.render('ConfigContacto', { title: 'Configuracion de Contactos' });



});

router.post('/', function (req, res, next) {
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  var regex = new RegExp(req.body.Contacto);

  Usuario.find({ user: regex })
  .exec().then( (result) => {

    console.log(result);
    res.render('ConfigContacto', { title: 'Configuracion Usuario', FilasBD: JSON.stringify(result)});
      
  });
 
});

module.exports = router;