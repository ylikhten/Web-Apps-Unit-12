var express = require('express');
var router = express.Router();
var ctrlListings = require('../controllers/listings');

//Listings
router.get('/listings', ctrlListings.allListings);
router.get('/listings/:item', ctrlListings.singleListing);
router.post('/listings/add', ctrlListings.addListing);

module.exports = router;
