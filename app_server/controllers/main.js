/* GET home page */
module.exports.index = function(req, res) {
    res.render('allListings', {title: 'BookBarterCSM'});
};

/*GET about page */
module.exports.about = function(req, res) {
    res.render('about', {title: 'About'});
};

/*GET Single Listing */
module.exports.singleListing = function(req, res) {
    res.render('singleListing', {title: 'Item'});
};

/*GET Add Listing Form */
module.exports.newListingForm = function(req, res) {
    res.render('addListingForm', {title: 'New Listing'});
};
