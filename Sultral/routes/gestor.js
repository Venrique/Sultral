var express = require('express');
var router = express.Router();
var fs = require('fs');

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
    titulo = "Acción exitosa";
    mensaje = "Se ha creado la nueva carpeta.";
  }

  if(status == 1002){
    reqAlert = true;
    titulo = "Fallo al realizar la descarga";
    mensaje = "El archivo solicitado pudo descargarse.";
  }

  if(status == 1003){
    reqAlert = true;
    titulo = "Acción exitosa";
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
    mensaje = "Se ha añadido el elemento a tu carpeta Favoritos.";
  }

  if(status == 1007){
    reqAlert = true;
    titulo = "Favoritos actualizado";
    mensaje = "Se ha removido el elemento de tu carpeta Favoritos.";
  }

  if(status == 1008){
    reqAlert = true;
    titulo = "Elemento trasladado";
    mensaje = "El elemento se ha trasladado a la papelera.";
  }

  if(status == 1009){
    reqAlert = true;
    titulo = "Elementos sin cambios";
    mensaje = "No se realizó ningún cambio en los elementos especificados.";
  }

  if(status == 1010){
    reqAlert = true;
    titulo = "Elementos eliminados";
    mensaje = "Se han eliminado los elementos especificados.";
  }

  if(status == 1011){
    reqAlert = true;
    titulo = "Elementos movidos";
    mensaje = "Se ha cambiado la ubicación de los elementos especificados.";
  }

  if(status == 1012){
    reqAlert = true;
    titulo = "Acción no permitida";
    mensaje = "No es posible mover un elemento a sí mismo.";
  }

  if(status == 1013){
    reqAlert = true;
    titulo = "Acción no permitida";
    mensaje = "No es posible mover un elemento a un fichero.";
  }

  if(status == 1014){
    reqAlert = true;
    titulo = "Archivo compartido";
    mensaje = "El archivo se ha compartido con todos tus contactos.";
  }

  if(status == 1015){
    reqAlert = true;
    titulo = "Sin cambios";
    mensaje = "No se realizaron cambios en la configuración de privacidad del elemento.";
  }

  if(status == 1016){
    reqAlert = true;
    titulo = "No se pudo cambiar";
    mensaje = "El nombre del archivo no pudo ser modificado.";
  }

  if(status == 1017){
    reqAlert = true;
    titulo = "Modificación exitosa";
    mensaje = "El nombre de la carpeta se modificó correctamente.";
  }

  Element.find({"_id": mongoose.Types.ObjectId(req.params.loc)}, { $or: [{"creador": mongoose.Types.ObjectId(decode.Id)} , {"compartido": mongoose.Types.ObjectId(decode.Id)}]})
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

                Element.find({"_id": { $in : user[0]['favorites'] } })
                .exec().then((favs) => {

                  Element.find({ $or: [ { $and: [{ "creador": mongoose.Types.ObjectId(decode.Id) }, { "compartido": { $not: { $size: 0 } } }] }, { "compartido": mongoose.Types.ObjectId(decode.Id) }] })
                  .exec().then((shared) => {

                    return res.render('Gestor', { title: 'Sultral', us: decode.Id ,varLoc: req.params.loc, carpetasOrigen: JSON.stringify(contFolders), contenido: JSON.stringify(files), actual: JSON.stringify(actual), contenedor: JSON.stringify(container), favoritos: user[0]['favorites'], favContent: JSON.stringify(favs), sharedContent: JSON.stringify(shared) , alert: reqAlert, alertT: titulo, alertM: mensaje });

                  })
  
                }); 

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

async function recorrido(contenido, callback) {
  for (let index = 0; index < contenido.length; index++) {
    await callback(contenido[index]);
  }
}

function eliminar(elemento, req, res, next, decode){
  Element.findOne({"_id": elemento})
  .exec().then((result) => {
    if(result.length != 0){
      console.log(elemento);
      if(result['ext'] != null){
        let path = './User_files/' + result['_id'] + '.sultral';
        fs.unlink(path, (err) => {
          if(err){
            console.log(err);
          }else{
            let size = (-1)*result['peso'];
            Usuario.findOneAndUpdate({"_id": mongoose.Types.ObjectId(decode.Id)}, { $inc: { storage: size} }, function (err, place) {
              if(err){
                console.log(err);
              }else{
                Element.findOneAndDelete({"_id": result['_id']}, function(err, rem){
                  if(err){
                    console.log(err);
                  }else{
                    if(req){
                      if(elemento == req.params.file){
                        return redirecting(req, res, next, 1010);
                      }
                    }
                  }
                }).catch((err) => {
                  if(err){
                    console.log(err);
                  }
                });
              }
            })          
          }
        });
      }else{
        console.log(result['nombre']);
        let contenido = result['contenido'];
        console.log(contenido);
        if(contenido.length > 0){
          const start = async () => {
            await recorrido(contenido, async (e) => {
              await eliminar(e, req, res, next, decode);
              console.log(e);
            });
            console.log('Hecho');
          }
          start();
        }
        Element.findOneAndDelete({"_id": result['_id']}, function(err, rem){
          if(err){
            console.log(err);
          }else{
            if(req){
              if(elemento == req.params.file){
                return redirecting(req, res, next, 1010);
              }
            }
          }
        }).catch((err) => {
          if(err){
            console.log(err);
          }
        });
        

      }
      
    }
  }).catch((err) => {
    if(err){
      console.log(err);
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

      let archivo = 'User_files/' + req.params.file + '.sultral';
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
    peso: null,
    contenedor: mongoose.Types.ObjectId(req.params.loc),
    contenido: [],
    creador: mongoose.Types.ObjectId(decode.Id),
    compartido: [],
    contprevio: null
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
          archivo.mv('./User_files/' + fileId + '.sultral', function (err) {
            if (err) {
              console.log(err);
            } else {
              const archivoup = new Element({
                _id: fileId,
                nombre: nombref[0],
                ext: nombref[1],
                peso: archivo.data.length/1024,
                contenedor: req.params.loc,
                contenido: null,
                creador: mongoose.Types.ObjectId(decode.Id),
                compartido: [],
                contprevio: null
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

router.post('/:loc/:file/mover', function (req, res, next) {
   if(req.body.newLoc == req.params.loc || req.body.newLoc == undefined){
    return redirecting(req, res, next, 1009);
   }else if(req.body.newLoc == req.params.file){
    return redirecting(req, res, next, 1012);
   }else{
    Element.findOne({_id: mongoose.Types.ObjectId(req.body.newLoc)})
    .exec().then((result) => {
      if(result['ext'] == null){
        Element.updateOne({ _id: mongoose.Types.ObjectId(req.params.file) }, { contenedor: req.body.newLoc }, function (err, place) {
          if (err) {
            console.log(err);
          }else{
            
            return redirecting(req, res, next, 1011);
    
          }
        });
      }else{

        return redirecting(req, res, next, 1013);

      }
    });
   }
});

router.get('/:loc/:id/del', function (req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Element.findOne({ nombre: 'papelera', contenedor: null, creador: mongoose.Types.ObjectId(decode.Id) }).exec()
  .then((papelera) => {

    Element.findOneAndUpdate({ _id: mongoose.Types.ObjectId(papelera._id) }, { $push: { contenido: mongoose.Types.ObjectId(req.params.id) } }, function (err, place) {
      if (err) {
        console.log(err);
      }else{
        Element.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
        .exec().then((result) => {

          Element.updateOne({ _id: result['_id'] }, { contprevio: result['contenedor'], contenedor: mongoose.Types.ObjectId(papelera._id) }, function (err, place) {
            if (err) {
              console.log(err);
            }else{
              
              Usuario.findOneAndUpdate({ _id: mongoose.Types.ObjectId(decode.Id) }, { $pull: { favorites: result['_id'] } }, function (err, place) {
                if (err) {
                  console.log(err);
                }else{
                  return redirecting(req, res, next, 1008);
                }
              });

            }
          });

        }); 
      }
    });
      
  })
  .catch(error => {
      console.log(error);
  });
});

router.get('/:loc/:file/exterminate', function(req, res, next) {
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  return eliminar(req.params.file, req, res, next, decode);
});

router.get('/:loc/:file/compartir', function(req,res,next){
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let bandera = false;
  Usuario.findOne({ _id: mongoose.Types.ObjectId(decode.Id)}).exec().then(usuario => {
    console.log(usuario['contactos']);

      const start = async () => {
        await recorrido(usuario['contactos'], async (e) => {
          console.log(e);
          await Element.findOne({_id: mongoose.Types.ObjectId(req.params.file), compartido: {$ne : e}}).exec().then(elemento =>{
            if(elemento != null){
              Element.findOneAndUpdate({_id: mongoose.Types.ObjectId(elemento['_id'])}, {$push: {compartido: e}}, function(err,place){
                if(err){
                  console.log(err);
                }else{
                  console.log('Si hizo update');
                  bandera = true;
                }
              });
            }
          console.log(e);
          });
        })
        console.log('Hecho');
        if(bandera){
          return redirecting(req,res,next,1014);
        }else{
          return redirecting(req,res,next,1015);
        }
      }
      start();
    
  }).catch(err =>{
    console.log(err);
  })

});

router.post('/:loc/:file/renombrar', function(req,res,next){
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Element.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.file), creador: mongoose.Types.ObjectId(decode.Id)}, {nombre: req.body.finame}, function(err,place){
    if(err){
      console.log(err);
      return redirecting(req,res,next,1016);
    }else{
      return redirecting(req,res,next,1017);
    }
  })
});

module.exports = router;
