var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);
router.get('/about', ctrlMain.about);
router.get('/listings/add', ctrlMain.newListingForm);
router.post('/listings/add', ctrlMain.postListingForm);
router.get('/listings/item/:listingid', ctrlMain.singleListing);
router.get('/listings/item/:listingid/delete', ctrlMain.deleteListing);

router.get('/register', ctrlMain.registrationForm);
router.post('/register', ctrlMain.postRegistrationForm);

router.get('/login', ctrlMain.loginForm);
router.post('/login', ctrlMain.postLoginForm);

module.exports = router;
