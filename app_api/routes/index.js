var express = require('express');
var router = express.Router();
var ctrlListings = require('../controllers/listings');
var ctrlAuth = require('../controllers/authentication');

//Listings
router.get('/listings', ctrlListings.allListings);
router.get('/listings/:listingid', ctrlListings.singleListing);
router.post('/listings/add', ctrlListings.addListing);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
