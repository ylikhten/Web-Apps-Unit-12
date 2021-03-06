var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});
var ctrlListings = require('../controllers/listings');
var ctrlAuth = require('../controllers/authentication');

//Listings
router.get('/listings', ctrlListings.allListings);
router.get('/listings/:listingid', ctrlListings.singleListing);
router.post('/listings/add', auth, ctrlListings.addListing);
router.delete('/listings/:listingid/delete', auth, ctrlListings.deleteListing);
router.put('/listings/:listingid', auth, ctrlListings.updateListing);
router.get('/userlistings', auth, ctrlListings.getUserListings);
router.post('/listings/:listingid/trade', auth, ctrlListings.postTrade);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
