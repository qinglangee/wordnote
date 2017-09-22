(function() {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    var http = require('http');
    var St = require('../common/string_utils');
    var Log = require('../common/log_utils');
    var youdaoParser = require('./youdao_parser');

    var searchQueue = [];
    var searching = false; // 正在查询的标志位，有单词在查询时设置为true
    var errCount = 0; // 错误重试计数器
    var maxErrTryCount = 10; // 最大错误重试次数
    var searchDelayInit = 1000; // 初始查询间隔
    var searchDelay = 1000; // 查询间隔
    
    /** 返回队列查询数量 */
    _.queueSize = function(){
        return searchQueue.length;
    }
    
    /** 放入队列，然后递归调用 */
    _.search = function(searchText, callback){
        searchQueue.splice(0, 0, {'text':searchText, 'callback':callback});
        if(!searching){
            _.recursiveSearch();
        }
    }
    
    // 设置查询下一个单词
    _.searchWordToNext = function(){
        searchQueue.length = searchQueue.length - 1; // 完成后队列长度减１
        errCount = 0;
        searchDelay = searchDelayInit + Math.round(Math.random()*5)*1000;
    }
    
    /** 递归查询单词队列 */
    _.recursiveSearch = function(){
        searching = true;
        if(searchQueue.length > 0){
            searching = true;
            var current = searchQueue[searchQueue.length - 1];
            
            try{
                // searchDelay = 1000;
                _.searchFromWeb(current.text, function(word){
                    if(word != null){
                        current.callback(word);
                        _.searchWordToNext();
                    }else{
                        errCount += 1;
                        searchDelay  = searchDelay + 30000;
                        if(errCount > maxErrTryCount){ // 超过最大重试次数，进行下一个
                            _.searchWordToNext();
                        }
                    }
                    setTimeout(function(){
                        _.recursiveSearch();
                    }, searchDelay);
                });
            }catch(e){
                Log.e("searchFromWeb find err:", e);
                setTimeout(function(){
                    _.recursiveSearch();
                }, searchDelay);
            }
        }else{
            searching = false;
        }
    }
    
    /** 查询网易网页 */
    _.searchFromWeb = function(searchText, callback){
        // Log.i("search from web 163.");

        var opt = {
            host:'dict.youdao.com',
            port:'80',
            method:'GET',
            path:'/search?keyfrom=dict.index&q=' + searchText,
            headers:{
                // "User-Agent":"Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0"
            }
        }

        var body = '';
        var req = http.request(opt, function(res) {
            //Log.i("Got response: " + res.statusCode);
            res.on('data',function(d){
                body += d;
            }).on('end', function(){
                try{
                    
                    var word = youdaoParser.parse(body);
                    // var word = {"text":searchText};
                    callback(word);
                }catch(err001){
                    Log.e("解析单词出错 :[" + searchText + "] ",err001);
                    callback(null);
                }
            });
        }).on('error', function(e) {
            Log.e("request word got error: " + e.message, e);
        });
        req.end();
        req = null;
    };


    var testFun = function(word){
        Log.i(word);
    };

    // _.search("hot", testFun);









    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports.youdao_dict = _;
    } else {
        root.youdao_dict = _;
    }
}).call(this);
