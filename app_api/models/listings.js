var mongoose = require ('mongoose');

var tradeOfferSchema = new mongoose.Schema({
  offer: {type: String, required: true},
  email: {type: String, required: true}
});

var listingSchema = new mongoose.Schema({
  title: {type:String, required: true},
  subject: String,
  description: String,
  trades: {type:String, required: true},
  offers: [tradeOfferSchema],
  userid: {type:String, required: true}
});

mongoose.model('Listing', listingSchema, 'listings');
