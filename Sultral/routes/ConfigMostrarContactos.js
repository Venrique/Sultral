var express = require('express');

var router = express.Router();
const Usuario = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.get('/',function(req,res,next){
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

    var regex = new RegExp(req.body.Contacto);
    console.log(decode.usuario);
    Usuario.findOne({user: decode.usuario}, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log(result['contactos']);
      Usuario.find({_id: {$in: result['contactos']}}, function(err, resultado){
        if(resultado.length != 0){
        console.log(resultado);
        res.render('ConfigMostrar', { title: 'Mostrar Contactos', FilasBD: JSON.stringify(resultado)});
        }else{
          res.render('ConfigMostrar',{ title: 'Mostrar Contactos', err: 'Esta cuenta no posee contactos'});

        }
      });
      
        
    });
});

router.get('/:valor', function(req, res) {
  
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Usuario.findOne({user: req.params.valor}).exec().then(usuario =>{
    if(usuario){
      Usuario.findOneAndUpdate({user: decode.usuario},{$pull: {contactos: mongoose.Types.ObjectId(usuario._id)  }}, function(err, place){
        if(err){
          console.log(err);
        }else{
          console.log('si dogg');
          res.redirect('/MostrarContactos');
        }
      });
    }else{
      console.log('nel dogg');
    }
  }).catch(error => {
    console.log(error);
});
  
  
});

module.exports = router;