var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Element = require('../models/element');
const jwt = require('jsonwebtoken');
const upload = require('express-fileupload');
const Usuario = require('../models/user');
router.use(upload());

function redirecting(req, res, next, status){

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let contFolders;
  let files, actual, container;
  let reqAlert, titulo, mensaje;
  reqAlert = false;

  if(status == 1000){
    reqAlert = true;
    titulo = "Error al crear carpeta";
    mensaje = "El nombre que intenta utilizar ya existe en este directorio.";
  }

  if(status == 1001){
    reqAlert = true;
    titulo = "Accion exitosa";
    mensaje = "Se ha creado la nueva carpeta.";
  }

  if(status == 1002){
    reqAlert = true;
    titulo = "Fallo al realizar la descarga";
    mensaje = "El archivo solicitado pudo descargarse.";
  }

  if(status == 1003){
    reqAlert = true;
    titulo = "Accion exitosa";
    mensaje = "Se ha subido el archivo.";
  }

  if(status == 1004){
    reqAlert = true;
    titulo = "Error al subir archivo";
    mensaje = "No cuenta con el espacio suficiente para subir este archivo.";
  }

  if(status == 1005){
    reqAlert = true;
    titulo = "Error al subir archivo";
    mensaje = "Ya existe un archivo con ese nombre y extensión en este directorio.";
  }

  if(status == 1006){
    reqAlert = true;
    titulo = "Favoritos actualizado";
    mensaje = "Se ha añadido el archivo a tu carpeta Favoritos.";
  }

  if(status == 1007){
    reqAlert = true;
    titulo = "Favoritos actualizado";
    mensaje = "Se ha eliminado el archivo de tu carpeta Favoritos.";
  }

  if(status == 1008){
    reqAlert = true;
    titulo = "Error";
    mensaje = "El elemento especificado no puede agregarse a favoritos.";
  }

  if(status == 1009){
    reqAlert = true;
    titulo = "Elemento trasladado";
    mensaje = "El elemento se ha trasladado a la papelera.";
  }

  Element.find({"_id": mongoose.Types.ObjectId(req.params.loc), "creador": mongoose.Types.ObjectId(decode.Id)})
  .exec().then((result) => {
    if(result.length != 0){
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

              Usuario.find({"_id": mongoose.Types.ObjectId(decode.Id)})
              .exec().then((user) => {
                return res.render('Gestor', { title: 'Sultral', varLoc: req.params.loc, carpetasOrigen: JSON.stringify(contFolders), contenido: JSON.stringify(files), actual: JSON.stringify(actual), contenedor: JSON.stringify(container), favoritos: user[0]['favorites'], alert: reqAlert, alertT: titulo, alertM: mensaje });

              }); 

            });

          });

        });

      });
    }else{
      return res.redirect('/Gestor/');
    }
  });
  
}

/* GET home page. */
router.get('/:loc', function (req, res, next) {

  
  return redirecting(req, res, next);
  

});

router.get('/:loc/:file', function (req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Element.find({"_id": mongoose.Types.ObjectId(req.params.file), "contenedor": mongoose.Types.ObjectId(req.params.loc), "creador": mongoose.Types.ObjectId(decode.Id)})
  .exec().then((result) => {
    if(result.length != 0){

      let archivo = 'Sultral/../User_files/' + req.params.file + '.sultral';
      res.download(archivo, result[0]['nombre']+"."+result[0]['ext']);
    }else{
      return redirecting(req, res, next, 1002);
    }
  });    

});

router.get('/:loc/:file/fav', function(req, res, next){
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  Element.find({ _id: mongoose.Types.ObjectId(req.params.file)})
  .exec().then((elem) => {
    if(elem[0]['ext'] != null){
      Usuario.find({ _id: mongoose.Types.ObjectId(decode.Id), favorites: mongoose.Types.ObjectId(req.params.file) })
      .exec().then((result) => {

        if(result.length == 0){
          Usuario.findOneAndUpdate({ _id: mongoose.Types.ObjectId(decode.Id) }, { $push: { favorites: mongoose.Types.ObjectId(req.params.file) } }, function (err, place) {
            if (err) {
              console.log(err);
            }else{
              return redirecting(req, res, next, 1006);
            }
          });
        }else{
          Usuario.findOneAndUpdate({ _id: mongoose.Types.ObjectId(decode.Id) }, { $pull: { favorites: mongoose.Types.ObjectId(req.params.file) } }, function (err, place) {
            if (err) {
              console.log(err);
            }else{
              return redirecting(req, res, next, 1007);
            }
          });
        }

      });
    }else{
      return redirecting(req, res, next, 1008);
    }
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
          }else{
            return redirecting(req, res, next, 1001);
          }
        });
      }).catch(error => {
        return res.status(400).redirect('/Gestor/' + req.params.loc);
      });
    }else{
      
      return redirecting(req, res, next, 1000);

    }

  });
});

router.post('/:loc/upload', function (req, res, next) {
  let archivo = req.files.finame;
  const fileId = new mongoose.Types.ObjectId();

  let nombref = req.files.finame.name.split(".");

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Element.find({nombre: nombref[0], ext: nombref[1], contenedor: mongoose.Types.ObjectId(req.params.loc)})
  .exec().then((almacenado) => {
    if(almacenado.length == 0){

      Usuario.find({ _id: mongoose.Types.ObjectId(decode.Id) })
      .exec().then((usu) => {
        
        if(archivo.data.length/1024 < usu[0]['maxstorage']-usu[0]['storage']){
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
                  }else{
                    Usuario.findOneAndUpdate({ _id: decode.Id }, { $inc: { storage: archivo.data.length/1024 } }, function (err, place) {
                      if (err) {
                        console.log(err);
                      }else{
                        return redirecting(req, res, next, 1003);
                      }
                    });
                  }
                });
              }).catch(error => {
                console.log(error);
                return res.status(400).redirect('/Gestor/' + req.params.loc);
              });
            }
        
          });
        }else{
          return redirecting(req, res, next, 1004);
        }

      });

    }else{
      return redirecting(req, res, next, 1005);
    }
  });
  
});

router.get('/:id/del/user', function (req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Element.findOne({ nombre: 'papelera', contenedor: null, creador: mongoose.Types.ObjectId(decode.Id) }).exec()
        .then(papelera => {

          Element.findOneAndUpdate({ _id: mongoose.Types.ObjectId(papelera._id) }, { $push: { contenido: mongoose.Types.ObjectId(req.params.id) } }, function (err, place) {
            if (err) {
              console.log(err);
            }else{
              Element.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { contenedor: mongoose.Types.ObjectId(papelera._id) }, function (err, place) {
                if (err) {
                  console.log(err);
                }else{
                  return redirecting(req, res, next, 1009);
                }
              });
            }
          });
            
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;
