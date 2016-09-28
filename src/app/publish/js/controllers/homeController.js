var app = angular.module('ljjTinyUrl');

//定义submit():"$scope"是two-way binding的关键,在前面声明一下,然后将"$scope", "$http"传入function中作为参数
app.controller("homeController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.submit = function () {
            //拿到inbox的longUrl

            //home.html中的input的ng-model="longUrl"
            //我们需要longUrl去干什么呢?我们需要把longUrl从前端传到后端,需要使用到angular js的ngResource(一个http api,满足REST)
            $http.post(
                "/api/v1/urls", {
                    longUrl: $scope.longUrl
                })    //想要把response:{shortUrl: ****, longUrl:*****}完成一些操作
                    .success(function (data) {
                        console.log("Here it is: " + data.shortUrl + "          !!!!!       ");
                        $location.path("/urls/" + data.shortUrl);
                        //location导航到你想要去的地址,data是返回的response的数据
                    });
                    //success()是在post成功以后需要完成的事
        }
    }
]);

/*
* $scope 控制html中的变量
* $location 控制页面转换
* $routeParams得到 router后的变量 例如 /:shortUrl
8 $http指向后端发送请求
*/