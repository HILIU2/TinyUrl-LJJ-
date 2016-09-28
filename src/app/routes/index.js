var express = require('express');
var router = express.Router();
var path = require('path');

//以app/v1/urls开头,从server.js过来,在这里处理
router.get('/', function (req, res) {
    res.sendfile('./publish/views/index.html');
});

module.exports = router;

