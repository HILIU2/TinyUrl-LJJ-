var app = angular.module('ljjTinyUrl');

//参数顺序是十分重要的,不能错
app.controller("urlController", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    $http.get("/api/v1/urls/" + $routeParams.shortUrl)
        .success(function (data) {
            $scope.shortUrl = data.shortUrl;
            $scope.longUrl = data.longUrl;
            $scope.shortUrlToShow = "http://" + data.shortUrl;
            /*怎样从后端得到totalClicks这个变量呢?需要从后端发送请求*/
        });

        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
            .success(function (data) {
                $scope.totalClicks = data;
            });

    /*因为这里是前端angularJS发送http.get请求,server.js中
      的router文件中处理这个/api/v1/urls/的请求,由于/api/v1已经在
      server.js中有router了,并且请求的是rest.js,所以在rest.js中
      加/urls的router*/

    /*课重用的代码,可以在很多图表中使用*/
    var renderChart = function (chart, infos) {
        $scope[chart + 'Labels'] = [];
        $scope[chart + 'Data'] = [];
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
            .success(function (data) {
                data.forEach(function (info) {
              /*此时的返回的groupId (info._id)已经不是字符串了,他是一个object,
                如果查询的是hour,那么此时应该push的是minute,若是day,则应该显示的是
                    hour。所以需要做特殊处理*/
                    $scope[chart + 'Labels'].push(info._id);
                    $scope[chart + 'Data'].push(info.count);
                });
            });
    };


    renderChart("pie", "referer");
    renderChart("doughnut", "country");
    renderChart("bar", "platform");
    renderChart("base", "browser");


/*将url.html处的getTime(hour), getTime(day)和getTime(month)
    改成getTime('hour'), getTiem('day')和get('month')那么传进来的
    就是string,不用再在urlController中定义变量了。*/

    $scope.hour = 'hour';
    $scope.day = 'day';
    $scope.month = 'month';


    $scope.getTime = function (time) {
        $scope.lineLabels = [];
        $scope.lineData = [];
        $scope.time = time;
        /*点击<a>以后call getTime(hour/day/month)function, 然后http router会
            提取到关于这个时间的数据, 返回data*/
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
            .success(function (data) {
                data.forEach(function (info) {

                var legend = '';
                if (time === 'hour') {
                    if (info._id.minutes < 10) { //format20:03
                        info._id.minutes = '0' + info._id.minutes;
                    }
                    legend = info._id.hour + ":" + info._id.minutes;
                }
                else if (time === 'day') {
                    legend = info._id.hour + ":00";
                }
                else if (time === 'month') {
                    if (info._id.day < 10) {
                        info._id.day = '0' + info._id.day;
                    }
                    legend = info._id.month + '/' + info._id.day;
                }

                    $scope['lineLabels'].push(info._id);
                    $scope['lineData'].push(info.count);
                });
            });
    };
    //默认显示hour
    $scope.getTime('hour');
}]);

//需要跟后端发请求的时候需要http