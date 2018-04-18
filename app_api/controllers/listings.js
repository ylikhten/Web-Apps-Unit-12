var mongoose = require('mongoose');
var Listing = mongoose.model('Listing');

//Get ALL Listings
module.exports.allListings = function(req,res) {
  Listing
    .find()
    .exec(function(err, listing){
        if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, listing);
    });
};

//Get ONE listing
module.exports.singleListing = function(req,res) {
  if (req.params && req.params.listingid) {
    Listing
      .findById(req.params.listingid)
      .exec(function(err, listing) {
        if (!listing) {
          sendJsonResponse(res, 404, {
            "message": "listingid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, listing);
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "No listingid in request"
    });
  }
};

module.exports.addListing = function(req, res){
  var newListing = new Listing({
    title: req.body.title,
    subject: req.body.subject,
    description: req.body.description,
    trades: req.body.trades
  });
  newListing.save(function(err, listing){
    if(err){
      sendJsonResponse(res, 400, err);
    }else{
      sendJsonResponse(res, 201, listing);
    }
  });
}

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};
