var mongoose = require('mongoose');
var Listing = mongoose.model('Listing');
var User = mongoose.model('User');

var getUser = function(req, res, callback) {
    if(req.payload && req.payload._id) {
        User.findOne({_id : req.payload._id}).exec(function(err, user) {
            if(!user) {
                sendJsonResponse(res, 401, {
                    "message": "User not found"
                });
                return;
            } else if (err) {
                console.log(err);
                sendJsonResponse(res, 404, err);
                return;
            }
            callback(req, res, user._id);
        });
    } else {
        sendJsonResponse(res, 401, {
            "message": "User not found"
        });
        return;
    }
};

module.exports.getUserListings = function(req, res){
  getUser(req, res, function(req, res, userid){
    Listing
      .find({userid: userid})
      .exec(function(err, listing){
          if (err) {
            sendJsonResponse(res, 404, err);
            return;
          }
          sendJsonResponse(res, 200, listing);
      });
  })
}

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
  getUser(req, res, function (req, res, userid){
    if (req.params && req.params.listingid) {
      Listing
      .findOne({_id: req.params.listingid, userid: userid})
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
        console.log(listing);
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
  });
};

//DELETE a single listing
module.exports.deleteListing = function(req,res) {
  getUser(req, res, function (req, res, userid){
    if (req.params && req.params.listingid) {
      Listing
        .findOne({_id: req.params.listingid, userid: userid})
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
  });
};

//PUT a new listing
module.exports.addListing = function(req, res){
    getUser(req, res, function (req, res, userid){
      var newListing = new Listing({
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        trades: req.body.trades,
        userid: userid
      });
                newListing.save(function(err, listing){
                    if(err){
                      sendJsonResponse(res, 400, err);
                    }else{
                      sendJsonResponse(res, 201, listing);
                    }
                });
   });
};

var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};
