var express = require('express');
const nodemailer = require('nodemailer');
var router = express.Router();

const jwt = require('jsonwebtoken');





router.get('/', function(req, res, next) {

    if(req.cookies.token != null){
      const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
      console.log(decode);
      res.render('Contactanos', { title: 'Sultral - Contactanos', sesion: true, user: decode.usuario });
    }else{
      res.render('Contactanos', { title: 'Sultral - Contactanos' });
    }
  });

router.post('/', function (req, res) {

    var regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (regexp.test(req.body.correo)) {
        let mailOpts, smtpTrans;
        smtpTrans = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "InfoSultral@gmail.com",
                pass: "SultralEsOtraOnda"
            }
        });
        mailOpts = {
            from: req.body.Nombre + ' &lt;' + req.body.correo + '&gt;',
            to: "InfoSultral@gmail.com",
            subject: req.body.motivo,
            text: `${req.body.nombre} ${req.body.apellido} (correo: ${req.body.correo})): ${req.body.mensaje}`
        };
        smtpTrans.sendMail(mailOpts, function (error, response) {
            if (error) {

            }
            else {

            }
        });
    }else{
        res.render('Contactanos', { title: 'Contactanos', acept: "El correo electronico ingresado en el campo de correo  no posee formato de correo " });
    }
    });

module.exports = router;