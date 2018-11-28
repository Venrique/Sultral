var express = require('express');

var router = express.Router();



router.get('/', function(req, res, next) {
    //console.log(req.params.hola);
    res.render('ConfigDetalle', { title: 'Configuracion Usuario' });
});


module.exports = router;