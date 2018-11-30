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
  var TodosUsuarios = [];
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  var cantidad=0;
  Usuario.find({}, function (err, usuarios) {
    usuarios.forEach(function (usuario) {
      
      TodosUsuarios.push(usuario._id);
      console.log(usuario._id);
      
      
    });
    console.log(TodosUsuarios);
     cantidad = TodosUsuarios.length;
     console.log(cantidad);
     
     res.render('ConfigContacto', { title: 'Configuracion Usuario', FilasBD: JSON.stringify(TodosUsuarios)});
    
    
    
  });
 
  /*
  Usuario.findOneAndUpdate({user: decode.usuario}, {$push: {contactos: mongoose.Types.ObjectId(user._id)}}, function(err, place){
    return res.render('ConfigContacto', { title: 'Configuracion Usuario', acept: "Se ha agregado el usuario correctamente" });
  });
}else{
  return res.render('ConfigContacto', { title: 'Configuracion Usuario', err: "El usuario  que se busca no existe" });
}*/
  });

module.exports = router;