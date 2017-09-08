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

    var jsdom = require('jsdom');
    var $ = require('jquery')(jsdom.jsdom().parentWindow);
    var http = require('http');
    var St = require('../common/string_utils');

    var searchQueue = [];
    var searching = false; // 正在查询的标志位，有单词在查询时设置为true
    
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
    
    /** 递归查询单词队列 */
    _.recursiveSearch = function(){
        searching = true;
        if(searchQueue.length > 0){
            searching = true;
            var current = searchQueue[searchQueue.length - 1];
            searchQueue.length = searchQueue.length - 1;
            try{
                _.searchFromWeb(current.text, function(word){
                    current.callback(word);
                    setTimeout(function(){
                        _.recursiveSearch();
                    }, 1000);
                });
            }catch(e){
                Log.e("searchFromWeb find err:", e);
                setTimeout(function(){
                    _.recursiveSearch();
                }, 1000);
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
                //Log.i(res.headers)
                // Log.i("body is:", body)
                var html = $(body);
                // 单词
                var keyword = html.find(".keyword");
                var text = St.trim(keyword.text());
                // 发音
                var pronounce = [];
                var pronName = html.find(".pronounce");
                var pronText = html.find(".phonetic")
                for(var i=0; i< pronName.length;i++){
                    $(pronText).remove();
                    var pronNameValue = $(pronName[i]).text()
                    var pron = {"name":St.trim(pronNameValue), "text":St.trim($(pronText[i]).text())};
                    pronounce[pronounce.length] = pron;
                }
                // 解释
                var translate = [];
                var transText = keyword.parent().siblings(".trans-container").find("ul>li");
                for(var i = 0; i < transText.length; i++){
                    translate[translate.length] = St.trim($(transText[i]).text());
                }

                // word 数据结构
                var word = {"text":text, "pronounce":pronounce, "translate":translate};
                if($.isFunction(callback)){
                    callback(word);
                }
            });
        }).on('error', function(e) {
            Log.e("request word got error: " + e.message, e);
        });
        req.end();
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
