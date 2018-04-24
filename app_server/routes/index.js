var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/about', ctrlMain.about);
router.get('/listings/add', ctrlMain.newListingForm);
router.post('/listings/add', ctrlMain.postListingForm);
router.get('/listings/item/:listingid', ctrlMain.singleListing);

module.exports = router;
