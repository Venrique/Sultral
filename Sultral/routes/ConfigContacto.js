var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/',function(req, res, next){
  res.render('ConfigContacto', {title: 'Configuracion de contactos'});

})

router.post('/', function (req, res, next) {
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  var regex = new RegExp(req.body.Contacto);
  Usuario.find({ user: regex })
  .exec().then((result) => {
    if(result){
    console.log(result);
    res.render('ConfigContacto', { title: 'Configuracion Usuario', FilasBD: JSON.stringify(result)});
    }
      
  });



});

router.get('/:valor', function(req, res) {
  console.log(req.params.valor);
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Usuario.findOne({user: req.params.valor}).exec().then(usuario =>{
    if(usuario){
      Usuario.findOneAndUpdate({user: decode.usuario},{$push: {contactos: mongoose.Types.ObjectId(usuario._id) }}, function(err, place){
        if(err){
          console.log(err);
        }else{
          console.log('Se agrego al usuario correctamente');
          res.redirect('/ConfigContacto')
        }
      });
    }else{
      console.log('No se encontro al usuario');
      res.redirect('/ConfigContacto')

    }
  }).catch(error => {
    console.log(error);
});

  

  
  
});

module.exports = router;