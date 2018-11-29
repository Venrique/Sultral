var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Element = require('../models/element');
const jwt = require('jsonwebtoken');
const upload = require('express-fileupload');
router.use(upload());

/* GET home page. */
router.get('/:loc', function (req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let contFolders;
  let files, actual, container;
  let reqAlert, titulo, mensaje;
  if(true){
    console.log("Error, mostrando");
    reqAlert = true;
    titulo = "Error al crear carpeta";
    mensaje = "El nombre que intenta utilizar ya existe en este directorio.";
  }

  Element.find({ "creador": mongoose.Types.ObjectId(decode.Id), "contenedor": null })
    .sort({ nombre: 1 })
    .exec().then((result) => {
      contFolders = result;

      Element.find({ "contenedor": mongoose.Types.ObjectId(req.params.loc) })
        .sort({ nombre: 1 })
        .exec().then((result) => {
          files = result;

          Element.find({ "_id": mongoose.Types.ObjectId(req.params.loc) })
            .sort({ nombre: 1 })
            .exec().then((result) => {
              actual = result;

              Element.find({ "contenido": mongoose.Types.ObjectId(req.params.loc) })
                .sort({ nombre: 1 })
                .exec().then((result) => {
                  container = result;

                  return res.render('Gestor', { title: 'Sultral', varLoc: req.params.loc, carpetasOrigen: JSON.stringify(contFolders), contenido: JSON.stringify(files), actual: JSON.stringify(actual), contenedor: JSON.stringify(container), alert: reqAlert, alertT: titulo, alertM: mensaje });

                });

            });

        });

    });

});

router.get('/', function (req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let folders;

  Element.find({ "creador": mongoose.Types.ObjectId(decode.Id), "contenedor": null })
    .sort({ nombre: 1 })
    .exec().then((result) => {
      folders = result;
      return res.render('Gestor', { title: 'Sultral', varLoc: "-", carpetasOrigen: JSON.stringify(folders), alert: false });
    });

});

router.post('/:loc', function (req, res, next) {
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let idCarpeta = new mongoose.Types.ObjectId();

  const carpeta = new Element({
    _id: idCarpeta,
    nombre: req.body.fname.trim(),
    ext: null,
    contenedor: mongoose.Types.ObjectId(req.params.loc),
    contenido: [],
    creador: mongoose.Types.ObjectId(decode.Id),
    compartido: []
  });

  Element.find({ "nombre": req.body.fname, "contenedor": mongoose.Types.ObjectId(req.params.loc) })
  .sort({ nombre: 1 })
  .exec().then((result) => {
    
    if(result.length == 0){
      carpeta.save().then(result => {
        console.log(result);
        Element.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.loc) }, { $push: { contenido: idCarpeta } }, function (err, place) {
          if (err) {
            console.log(err);
          }
        });
        return res.status(200).redirect('/Gestor/' + req.params.loc);
      }).catch(error => {
        console.log(error);
        return res.status(400).redirect('/Gestor/' + req.params.loc);
      });
    }else{
      
      return res.status(409).redirect('/Gestor/' + req.params.loc);

    }

  });
});

router.post('/:loc/upload', function (req, res, next) {
  let archivo = req.files.finame;
  const fileId = new mongoose.Types.ObjectId();

  let nombref = req.files.finame.name.split(".");

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  archivo.mv('Sultral/../User_files/' + fileId + '.sultral', function (err) {
    if (err) {
      console.log(err);
    } else {
      const archivoup = new Element({
        _id: fileId,
        nombre: nombref[0],
        ext: nombref[1],
        contenedor: req.params.loc,
        contenido: null,
        creador: mongoose.Types.ObjectId(decode.Id),
        compartido: []
      });

      archivoup.save().then(result => {
        console.log(result);
        Element.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.loc) }, { $push: { contenido: fileId } }, function (err, place) {
          if (err) {
            console.log(err);
          }
        });
        return res.status(200).redirect('/Gestor/' + req.params.loc);
      }).catch(error => {
        console.log(error);
        return res.status(400).redirect('/Gestor/' + req.params.loc);
      });
    }

  });
});


module.exports = router;
