var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var requestService = require('../services/statesServices');

//过来一个短链接,browser重定向到长链接去
router.get('*', function (req, res) {
    var shortUrl = req.originalUrl.slice(1);
    var longUrl = urlService.getLongUrl(shortUrl, function (url) {
         /*注意返回的是一个json文件,UrlModel*/
        if (url) {
            res.redirect(url.longUrl);
            requestService.logRequest(shortUrl, req);
            /*记录是哪个shortUrl, 将整个http request当成参数传进去*/
        }
        else {
            res.sendfile ('./publish/views/404.html');
        }

    });
    //返回的是www.google.com,并不是一个valid 的url,因为没有http协议
 });


module.exports = router;