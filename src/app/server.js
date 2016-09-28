var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var useragent = require('express-useragent');


mongoose.connect('mongodb://liujunjie:liujunjie@ds017726.mlab.com:17726/ljj_tinyurl');

//两个全局变量
app.longToShortHash = {};
app.shortToLongHash = {};


/*在index.js文件中有引用,如果没有这一句,那么所有去nodemodules的请求都会
    redirect到*/
app.use('/node_modules', express.static(__dirname + "/node_modules"));

//请求静态文件:只要是有/publish的url,就返回总目录下相应的静态文件

app.use('/publish', express.static(__dirname + "/publish"));
/*收到一个http请求,首先看是不是以/publish开头的
      如果是,则拦截住,返回express.static()里的文件*/

app.use(useragent.express());
/*这个是一个中间件的概念,我拿到http rquest,我去读request里user agent
  的信息,读完以后,将提取的信息都加回到request中,可以到时候直接用。接下来这个
  request会往下走 "api/v1", '/'看是否符合,符合则进入对应的router*/


app.use('/api/v1', restRouter);   //request如果是以/api/v1开头的,有restRouter处理

app.use('/', indexRouter); //用户敲了域名以后,返回TinyUrl的主页的页面

app.use('/:shortUrl', redirectRouter);

app.listen(3000);

/*localhost:3000/:是有node.js控制直接转到node.js,但是我们为了让前端对数据
   做一些处理,对网页做一些routing,因为我们不想要每次发一个url给后端处理,让后
   每次都让后端发回一个页面,因此我们也希望在前端加router,前端angular js的router
   对localhost:3000/#/进行监听,如果没有#,任何url request都发给node.js去处理。
   相当于angular在中间拦截了一些请求*/


/*把 models playground publish routes services server.js放进qpp这个包里,
   因为之后我们就要加redis, Nginx了,那么app的就属于app server端的代码, 我们的
   DB是使用的mLab的第三方support*/