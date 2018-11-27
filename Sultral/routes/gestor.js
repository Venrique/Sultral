var express = require('express');
var router = express.Router();
const checkToken = require('../middleware/check_token');

/* GET home page. */
router.get('/:username/:loc',checkToken, function(req, res, next) {

  res.render('Gestor', { title: 'Sultral', varLoc: req.params.loc, username: req.params.username});
  

});

router.get('/:username/',checkToken, function(req, res, next) {

  res.render('Gestor', { title: 'Sultral', varLoc: 'Root', username: req.params.username});
  

});

module.exports = router;
