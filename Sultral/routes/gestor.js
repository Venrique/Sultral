var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Element = require('../models/element');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/:loc', function(req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let contFolders;
  let files, actual, container;
  
  Element.find({"creador": mongoose.Types.ObjectId(decode.Id), "contenedor": null})
  .sort( { nombre: 1 } )
  .exec().then((result) =>{
    contFolders = result;

    Element.find({"contenedor": mongoose.Types.ObjectId(req.params.loc)})
    .sort( { nombre: 1 } )
    .exec().then((result) =>{
      files = result;

      Element.find({"_id": mongoose.Types.ObjectId(req.params.loc)})
      .sort( { nombre: 1 } )
      .exec().then((result) =>{
        actual = result;

        Element.find({"contenido": mongoose.Types.ObjectId(req.params.loc)})
        .sort( { nombre: 1 } )
        .exec().then((result) =>{
          container = result;

          return res.render('Gestor', { title: 'Sultral', varLoc: req.params.loc, carpetasOrigen: JSON.stringify(contFolders), contenido: JSON.stringify(files), actual: JSON.stringify(actual), contenedor: JSON.stringify(container)});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        });

      });

    });

  });

});

router.get('/', function(req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let folders;
  
  Element.find({"creador": mongoose.Types.ObjectId(decode.Id), "contenedor": null})
  .sort( { nombre: 1 } )
  .exec().then((result) =>{
    folders = result;
    return res.render('Gestor', { title: 'Sultral', varLoc: "-", carpetasOrigen: JSON.stringify(folders)});
  });
  
});

router.post('/:loc', function(req, res, next){
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let idCarpeta = new mongoose.Types.ObjectId();

  const carpeta = new Element({
    _id: idCarpeta,
    nombre: req.body.fname.trim(),
    ext: null,
    contenedor: req.params.loc,
    contenido: [],
    creador: mongoose.Types.ObjectId(decode.Id),
    compartido: []
  });

  carpeta.save().then(result => {
    console.log(result);
    Element.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.loc)}, {$push: { contenido: idCarpeta}}, function(err, place){
      if(err){
        console.log(err);
      }
    });
    return res.status(200).redirect('/Gestor/'+req.params.loc);
  }).catch(error => {
    console.log(error);
    return res.status(400);
  });

});

module.exports = router;
