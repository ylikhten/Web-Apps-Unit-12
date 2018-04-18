var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/about', ctrlMain.about);
router.get('/listings/add', ctrlMain.newListingForm);
router.get('listings/item', ctrlMain.singleListing);

module.exports = router;
