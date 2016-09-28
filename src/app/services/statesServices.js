var geoip = require('geoip-lite');
var requestModel = require('../models/requestModel');

var logRequest = function (shortUrl, req) {
    /*这个方法我们需要存一些在req里有用的信息
      */

    var reqInfo = {};
    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || "Unknown";
    /*知道是从哪个网站转到这个url的,即大家在哪个网站点的这个url, http request的header中有referer
      如果有referer则记录,没有referer则记为 Unknown*/

    /*express user agent: 是否是手机,桌面,机器人访问,是什么浏览器,平台,操作系统
        在http request中有个一user agent, 提取这个信息*/

    reqInfo.platform = req.useragent.platform || "Unknown";//查user agent的官方文档
    reqInfo.browser = req.useragent.browser || "Unknown";
    var ip = req.headers['x-forwarded-for'] ||   //拿这个rquest的ip(网上查的)
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    if (geo) {
        reqInfo.country = geo.country;
    }
    else {
        reqInfo.country = "Unknown";
    }

    reqInfo.timestamp = new Date();

    /*把信息存到数据库里,建一个model*/
    var request = new requestModel(reqInfo);
    request.save();
};


var getUrlInfo = function (shortUrl, info, callback) {
      if (info === 'totalClicks') {
      //这个callback是被mongoDB调用的
        requestModel.count({shortUrl: shortUrl}, function (err, data) {
            callback(data);
        });
        return;
      }

      var groupId = "";


        /*当我们需要传过来的数据是hour, day, month时,这个时候直接使用groupId是错误的
            我们并没有一个variable叫hour,day,month。我们实际上是通过,所有8月的放在一
            个地方,然后他这些加起来*/
      if (info === "hour") {
            groupId = {
                year: { $year: "$timestamp"},
                month: { $month: "$timestamp"},
                day: { $dayOfMonth: "$timestamp"},
                hour: { $hour: "$timestamp"},
                minutes: { $minute: "$timestamp"},
            }
            /*在groupId里面将timestamp的年月日小时分钟全都提取出来。请把2016年8月29号
                8点37分放一个地方, 8点38分放另一个地方。这是统计的精度*/
      }
      else if (info === "day") {
          groupId = {
              year: { $year: "$timestamp"},
              month: { $month: "$timestamp"},
              day: { $dayOfMonth: "$timestamp"},
              hour: { $hour: "$timestamp"},
                      }
      }
      else if (info === "month") {
            groupId = {
                            year: { $year: "$timestamp"},
                            month: { $month: "$timestamp"},
                            day: { $dayOfMonth: "$timestamp"},
                            hour: { $hour: "$timestamp"},
                        }
      }
      else {
        groupId = "$" + info;
      }
//当info不是有关时间的,那么就是referer, platform这些


      /*基于referer不同的值分别count,就是 select count() group by referer*/
      requestModel.aggregate([
                    {
                        $match: {
                        //请返回所有document,这些document里的shortUrl都是:shortUrl
                            shortUrl: shortUrl}
                    },
                    {
                        $sort : {
                            timestamp : -1  //会涉及过去一小时,过去两小时的访问
                        }
                    },
                    {
                        $group : {
                            _id: groupId,
                            count: {
                                $sum : 1    //固定写法, 每个referer代表1,加起来
                            }
                        }
                    }
                ], function(err,data) {
                    callback(data);
                  });
};
/*把所有shortUrl拿出来,按时间顺序排列,然后按照groupId进行分组总计*/

module.exports = {
  logRequest: logRequest,
  getUrlInfo : getUrlInfo
};