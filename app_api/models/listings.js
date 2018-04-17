var mongoose = require ('mongoose');

var listingSchema = new mongoose.Schema({
  title: {type:String, required: true},
  subject: String,
  description: String,
  trades: {type:String, required: true}
});

mongoose.model('Listing', listingSchema);