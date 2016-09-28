var http = require('http');
//require == java.import 引入一个包赋给一个变量

var fs = require('fs');

//http.createServer(function (req, res) {
//    console.log("server started");
//    res.writeHead(200, {"Content-Type": "text-html"});
//    var html = fs.readFileSync(__dirname + '/index.html'); //同步的去读文件
//    res.end(html);
//    //只有这一句,那运行起来什么都没有发生,因为server没有收到任何request
//    //我们只是创建了一个server,我们没有告诉server去监听那个端口
//}).listen(3000); //listen: 打开浏览器,输入localhost:3000,那么terminal中会输出 server started
////传一个callback function: server创建起来以后处理请求
//
////但是是这样的话会死在当前,所以需要将response 发回去


//http.createServer(function (req, res) {
//    if(req.url === '/') {
//
//        res.writeHead(200, {"Content-Type": "text-html"});
//        var html = fs.readFileSync(__dirname + "/index.html");
//        res.end("<html><head></head><body><h1>New Line</h1></body></html>");
//    }
//
//    if(req.url === '/api') {
//
//            res.writeHead(200, {"Content-Type": "application/json"});
//            var obj = {
//                name: "zhengwang",
//                age: 80
//            };
//            res.end(JSON.stringify(obj));
//        }
//}).listen(3000);





//如果没有路径,那nodejs会去check核心包,然后去node_modules找
var apiRouter = require('./routes/api') //本目录下routes/api

var express = require('express');
var app = express();
var redirectRouter = require('./routes/redirect');

app.use('/api/v1', apiRouter);

app.use('/:shortUrl', redirectRouter);
//要有:,不做纯字符串的matching,:后面是一个变量

app.listen(3000);






