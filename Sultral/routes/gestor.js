var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:username/:loc', function(req, res, next) {

  res.render('Gestor', { title: 'Sultral', varLoc: req.params.loc, username: req.params.username});
  

});

module.exports = router;
