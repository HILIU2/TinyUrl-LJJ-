var encode = []; // 0-9, a~z, A~Z

//拿到urlModel
var UrlModel = require('../models/urlModel');

/*到目前为止,我们并没有使用任何有关redis的服务,尽管我们已经在docker-compose.yml中添加
    了cache : redis。所以我们需要在getLongUrl()和getShortUrl()中先访问redis,再去
    访问mongoDB*/
var redis = require('redis'); //拿到了redis的包
var host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT || '6379';

/*process.env.REDIS_PORT_6379_TCP_ADD: 传redis所在的host所在的IP address,
    如果没有人传process.env.REDIS_PORT_6379_TCP_ADD这个,那么用默认的地址
    "127.0.0.1"。但是我们并没有传var host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
    这个呀!!这是docker做的事情*/

var redisClient = redis.createClient(port, host); //先写port后写host

var genCharArray = function (charA, charZ) {
    var arr = [];
    var i = charA.charCodeAt(0);
    var j = charA.charCodeAt(0);

    for (; i <= j; i++) {
        arr.push(String.fromCharCode(i))
    }
    return arr;
};

encode = encode.concat(genCharArray('a', 'z'));
encode = encode.concat(genCharArray('0', '9'));
encode = encode.concat(genCharArray('A', 'Z'));

//callback代表这是一个callback function
var getShortUrl = function (longUrl, callback) {
    if ( longUrl.indexOf('http') === -1 ) {
        longUrl = "http://" + longUrl;
    }

    redisClient.get(longUrl, function (err, shortUrl) {
        if (shortUrl) {
            console.log("byebye, MonGGGGGGGGGoDB!!");
            callback ({
                longUrl: longUrl,
                shortUrl:  shortUrl
            });
        }
        else {
            /*首先先声明数据库表的样子,参见models/urlModel.js.
                findOne是mongoDB的api,找到longUrl对应的shortUrl,longUrl : longUrl
                第一个longUrl是identifier, 第二个是传进来的longUrl变量。
                这个callback function会有两种返回值,第一种是err,没有找到,第二种是url_Json,
                是在urlModel里定义的返回的json格式*/


                UrlModel.findOne({ longUrl : longUrl}, function (err, url) {
                    if (url) {
                        /*往redis中写数据*/
//                        redisClient.set(shortUrl, longUrl);
//                        redisClient.set(longUrl, shortUrl);
                        console.log("I found the url in MongoDB!!! For the first time");
                        callback(url);
                        /*callback(url) url是返回的response*/
                    }
                    else {
                            /*如果没有找到,则要生成shortUrl*/
                            generateShortUrl (function (shortUrl) {
                           /*生成以后需要写入数据库中, 首先创建一个写入数据库的instance*/
                            var url = new UrlModel({shortUrl : shortUrl,
                                                    longUrl : longUrl
                                                    });
                           /*发给数据库*/
                           url.save();
                           /*发回给callback function*/

                           /*往redis中写数据*/
                           redisClient.set(shortUrl, longUrl);
                           redisClient.set(longUrl, shortUrl);

                           callback(url); //callback新new url
                        });
                    }
                });
        }
    })



};

//incremental function
//var generateShortUrl = function (longToShortHash) {
//    return Object.keys(longToShortHash).length;
//    //不能直接 longToShortHash.length
//};

var generateShortUrl = function (callback) {
    /*将find()找到的所有urls传入callback function中*/
    UrlModel.find({}, function (err, urls) {
       callback(convertTo62(urls.length));
    });

};

var convertTo62 = function (num) {
    var result = '';
    do {
        result = encode[num % 62] + result;
        num = Math.floor(num / 62);
    } while (num);

    return result;
};

var getLongUrl = function (shortUrl, callback) {

    redisClient.get(shortUrl, function (err, longUrl) {
        if (longUrl) {
            callback ({
                longUrl: longUrl,
                shortUrl: shortUrl
            });
        }
        else {
            //返回的url是schema的格式
                UrlModel.findOne({shortUrl : shortUrl}, function (err, url) {
                    callback(url);
                });
        }
    });


};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl : getLongUrl
    //输出的是一个function, function name是getShortUrl
};