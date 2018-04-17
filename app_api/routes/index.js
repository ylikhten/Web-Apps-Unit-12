var express = require('express');
var router = express.Router();
var ctrlListings = require('../controllers/listings');

//classes
router.get('/listings', ctrlClasses.allListings);

module.exports = router;
