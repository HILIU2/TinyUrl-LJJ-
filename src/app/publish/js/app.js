var app = angular.module('ljjTinyUrl', ['ngRoute', 'ngResource', 'chart.js']);

app.config (function ($routeProvider) {
    $routeProvider

    /*angular的/识别的是#之后的/*/
        .when(
            "/", {
                templateUrl: "./publish/views/home.html",
                controller: "homeController"
            })
                ///url后面是shortUrl:一堆东西,所以可以用变量代替,:代表后面的是变量
        .when("/urls/:shortUrl", {
            templateUrl: "./publish/views/url.html",
            controller: "urlController"
        });
});
//用angular route模块,调用routeProvider的when function
//如果当前的url是根目录,localhost:3000/#/是angular的根目录(localhost:3000/是前面node.js的根目录)
//在angular js的根目录下嵌入(注意是嵌入,single page)home.html网页,并用homeController.js来控制网页的行为



//app.call说明这个function只是这个app下的function, 不会和其他function冲突
//app.call = function