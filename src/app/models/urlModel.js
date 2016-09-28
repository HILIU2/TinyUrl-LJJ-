/*定义mongoDB里面表的schema*/

/*用了mongoDB之后就不需要维护shortToLongHash和longToShortHash两个表了
  因为mongoDb已经能够handle这两个功能了*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
    longUrl : String,
    shortUrl : String
});

var urlModel = mongoose.model('urlModel', UrlSchema);

module.exports = urlModel;

/*定义了一个关于url的Model和它的schema,我们希望数据库表里面longUrl, shortUrl都
  存成String,我们发送数据给mLab的时候希望发送的是这种格式的数据,我们从mLab中读取
  数据也会是这种格式*/