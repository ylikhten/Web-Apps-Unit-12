var request = require('request');

var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://localhost:3000" // What is our heroku url??
    //apiOptions.server = "https://fierce-tundra-31161.herokuapp.com/"
}

var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
        title = "404, page not found";
        content = "This page can not be found.";
    } else if (status === 500) {
        title = "500, internal server error";
        content = "Server error.";
    } else {
        title = status + ", something's gone wrong";
        content = "Check error code.";
    }
    res.status(status);
    res.render('genericText', {
        title : title,
        content : content
    });
};

var renderHomepage = function (req, res, responseBody) {
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No listings in database";
        }
    }

    res.render('allListings', {
        title: 'BookBarterCSM',
        listings: responseBody,
        message: message
    });
}

/* GET home page */
module.exports.index = function(req, res) {
    var requestOptions, path;
    path = '/api/listings';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            var data;
            data = body;
            renderHomepage(req, res, data);
        }
    );
};

/*GET about page */
module.exports.about = function(req, res) {
    res.render('about', {title: 'About'});
};

/* Registration */

/* GET registration page */
module.exports.registrationForm = function (req, res) {
    res.render('registrationForm', {error: req.query.err})
};

/* POST register page */
module.exports.postRegistrationForm = function (req, res) {
    var requestOptions, path;
    path = "/api/register";
    postData = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    };

    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData
    };
    console.log(postData);
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.redirect('/register/?err=val');
    } else {
        request (requestOptions, function (err, response, body) {
            console.log(body);
            if (response.statusCode === 200) {
                res.redirect('/');
            } else if (response.statusCode === 400 && body.name && body.email === "ValidationError") {
                res.redirect('/register/?err=val');
            } else if(response.statusCode === 401 && body.code === 11000){
                res.redirect('/register/?err=dup');
            } else {
                _showError(req, res, response.statusCode);
            }
        });
     }
 };

/* Login */

/* GET login page */
module.exports.loginForm = function (req, res) {
    res.render('loginForm', {error: req.query.err});
};

/* POST login page */
module.exports.postLoginForm = function (req, res) {
    var requestOptions, path;
    path = "/api/login";
    postData = {
        email : req.body.email,
        password : req.body.password
    };

    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postData
    };
    if (!req.body.email || !req.body.password) {
        res.redirect('/login/?err=val');
    } else {
        request (requestOptions, function (err, response, body) {
            console.log(body);
            if (response.statusCode === 200) {
                res.redirect('/');
            } else if (response.statusCode === 400 && body.password && body.email === "ValidationError") {
                res.redirect('/login/?err=val');
            } else if(response.statusCode === 401 && body.message === 'Incorrect password.'){
                res.redirect('/login/?err=pas');
            } else {
                _showError(req, res, response.statusCode);
            }
        });
     }
 };


/*GET Single Listing */
var getListingInfo = function (req, res, callback) {
    var requestOptions, path;
    path = "/api/listings/" + req.params.listingid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};
var renderListingPage = function (req, res, listing) {
    res.render('singleListing', {
        title: listing.title,
        subject: listing.subject,
        description: listing.description,
        trades: listing.trades,
        id: listing._id
    });
};
module.exports.singleListing = function(req, res) {
    getListingInfo(req, res, function(req, res, responseData) {
        renderListingPage(req, res, responseData);
    });
};

/*GET Add Listing Form */
module.exports.newListingForm = function(req, res) {
    res.render('addListingForm', {title: 'New Listing',
                                  head: 'Post New Barter Item',
                                  b_text: 'Post Item',
                                  err: req.query.err,
                                  options: options,
                                  listing: {
                                    title: "",
                                    subject: "",
                                    description: "",
                                    trades: ""}});
};

/*GET Update Listing Form*/
module.exports.updateListingForm = function(req, res) {
  var path = '/api/listings/' + req.params.listingid;
  var requestOptions = {
    url : apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(requestOptions, function(err, response, body){
    var listing = body;
    console.log(listing);
    res.render('addListingForm', {title: 'Update Listing',
                                  head: 'Update Barter Item',
                                  b_text: 'Update Item',
                                  err: req.query.err,
                                  options: options,
                                  listing: listing});
  });
};

/*POST New Listing from Form */
module.exports.postListingForm = function(req, res){
    var requestOptions, path, postdata;
    path = "/api/listings/add";
    console.log(req.headers['x-access-token']);
    postdata = {
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        trades: req.body.trades,
//        token: req.payload.token
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postdata
    };
    if (!postdata.title || !postdata.subject|| !postdata.trades || !postdata.description) {
        res.redirect('/listings/add?err=val');

    // TODO ensure poster is logged in, also who is posting??
    } else if (false) {
        res.redirect('/listings/add?err=val');
    } else {
        request(
            requestOptions,
            function(err, response, body) {
                if (response.statusCode === 201) {
                    res.redirect('/'); // Or the user's listings.......
                } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                    res.redirect('/listings/add?err=val');
                } else {
                    console.log(body);
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }
};

module.exports.postUpdateListingForm = function(req, res){
  var requestOptions, path, postdata;
  path = "/api/listings/" + req.params.listingid;
  postdata = {
      title: req.body.title,
      subject: req.body.subject,
      description: req.body.description,
      trades: req.body.trades
  };
  requestOptions = {
      url : apiOptions.server + path,
      method : "PUT",
      json : postdata
  };
  if (!postdata.title || !postdata.subject || !postdata.trades || !postdata.description) {
      res.redirect('/listings/add?err=val');

  // TODO ensure poster is logged in, also who is posting??
  } else if (false) {
      res.redirect('/listings/add?err=val');
  } else {
      request(
          requestOptions,
          function(err, response, body) {
              if (response.statusCode === 200) {
                  res.redirect('/'); // Or the user's listings.......
              } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
                  res.redirect('/listings/add?err=val');
              } else {
                  console.log(body);
                  _showError(req, res, response.statusCode);
              }
          }
      );
  }
};

/* DELETE a listing */
module.exports.deleteListing = function(req, res) {
    var requestOptions, path;
    path = "/api/listings/" + req.params.listingid + "/delete";
    requestOptions = {
        url : apiOptions.server + path,
        method : "DELETE",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
}

var options = [
  'AFGN',
  'CBEN',
  'CEEN',
  'CHGC',
  'CHGN',
  'CSCI',
  'CSM',
  'EBGN',
  'EENG',
  'EGGN',
  'ENGY',
  'EPIC',
  'GEGN',
  'GEOL',
  'GPGN',
  'HNRS',
  'LAIS',
  'LIFL',
  'LIMU',
  'MATH',
  'MEGN',
  'MLGN',
  'MNGN',
  'MSGN',
  'MTGN',
  'NUGN',
  'PEGN',
  'PHGN',
  'SYGN', 'Other/Unknown'];
