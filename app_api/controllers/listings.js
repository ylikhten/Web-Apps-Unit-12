var mongoose = require('mongoose');
var Course = mongoose.model('Listing');

module.exports.allListings = function(req,res) {
  Listing
    .find()
    .exec(function(err, courses) {
        if (!listings) {
          sendJsonResponse(res, 404, {
            "message": "listingid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, courses);
    });
};


var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};
