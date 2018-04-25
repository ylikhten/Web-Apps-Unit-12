var mongoose = require('mongoose');
var Listing = mongoose.model('Listing');
var User = mongoose.model('User');

var getUser = function(req, res, callback) {
    if(req.payload && req.payload.email) {
        User.findOne({email : req.payload.email}).exec(function(err, user) {
            if(!user) {
                sendJsonResponse(res, 404, {
                    "message": "User not found"
                });
                return;
            } else if (err) {
                console.log(err);
                sendJsonResponse(res, 404, err);
                return;
            }
            callback(req, res, user.name);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "User not found"
        });
        return;
    }
};

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

module.exports.updateListing = function(req,res) {
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
        listing.title = req.body.title;
        listing.subject = req.body.subject;
        listing.description = req.body.description;
        listing.trades = req.body.trades;
        listing.save(function(err, listing){
          if(err){
            sendJsonResponse(res, 400, err);
          }else{
            sendJsonResponse(res, 200, {
              "message": "updated"
            });
          }
        });
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "No listingid in request"
    });
  }
};

//DELETE a single listing
module.exports.deleteListing = function(req,res) {
  if (req.params && req.params.listingid) {
    Listing
      .findById(req.params.listingid)
      .remove(function(err, listing) {
        if (!listing) {
          sendJsonResponse(res, 404, {
            "message": "listingid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
          sendJsonResponse(res, 204, null);
      });
  } else {
    sendJsonResponse(res, 404, {
      "message": "No listingid in request"
    });
  }
};

//PUT a new listing
module.exports.addListing = function(req, res){
    getUser(req, res, function (req, res, userName){
      var newListing = new Listing({
        name: userName,
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
   });
}

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};
