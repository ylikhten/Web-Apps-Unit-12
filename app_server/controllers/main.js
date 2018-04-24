var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://localhost:3000" // What is our heroku url??
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
    res.render('generic-text', {
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
        trades: listing.trades
    });
};
module.exports.singleListing = function(req, res) {
    getListingInfo(req, res, function(req, res, responseData) {
        renderListingPage(req, res, responseData);
    });
};

/*GET Add Listing Form */
module.exports.newListingForm = function(req, res) {
    res.render('addListingForm', {title: 'New Listing'});
};
/*POST New Listing from Form */
module.exports.postListingForm = function(req, res){
    var requestOptions, path, postdata;
    path = "/api/listings/add";
    postdata = {
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        trades: req.body.trades
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "POST",
        json : postdata
    };
    if (!postdata.title || !postdata.subject || !postdata.subject || !postdata.description) {
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
