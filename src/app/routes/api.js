var express = require('express');
var router = express.Router();

//解析post请求发过来的json,需要另一个包body-parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('urls', jsonParser, function (req, res){

});

//将文件作为一个包输出,以便进行调用

module.export = router;