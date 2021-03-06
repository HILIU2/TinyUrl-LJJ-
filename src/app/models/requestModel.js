var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*schema*/
var RequestSchema = new Schema({
    shortUrl : String,
    referer : String,
    platform : String,
    browser : String,
    country : String,
    timestamp : Date
});

var requestModel = mongoose.model('RequestModel', RequestSchema);

module.exports = requestModel;
