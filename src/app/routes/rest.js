var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlService = require('../services/urlService');
var statesService = require('../services/statesServices');

//以app/v1/urls开头,从server.js过来,在这里处理
router.post('/urls', jsonParser, function (req, res) {
    var longUrl = req.body.longUrl;
    /*function (url) 括号里的url是callback function的response,
    参见service.urlService 中的callback(url),这个callback function是异步*/
    urlService.getShortUrl(longUrl, function (url) {
        res.json(url);
    });
    //如果这个longUrl已经有了对应的shortUrl,因此依旧需要将longUrl当成参数传进去
});

router.get('/urls/:shortUrl', function (req, res) {
    var shortUrl = req.params.shortUrl;
    var longUrl = urlService.getLongUrl(shortUrl, function (url_Collection) {
        if (url_Collection) {
            res.json(url_Collection);
        }
        else {
            res.status(404).send("What??????");
        }
    });
});


//info是click之后产生的
router.get("/urls/:shortUrl/:info", function (req, res) {

//callback传的是mongoDB返回的数据
    statesService.getUrlInfo(req.params.shortUrl, req.params.info, function(data) {
        res.json(data);
        /*res将数据返回前端*/
    });
});

module.exports = router;