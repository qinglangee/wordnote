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

    _.search = function(searchText, callback){

        var opt = {
            host:'dict.youdao.com',
            port:'80',
            method:'GET',
            path:'/search?keyfrom=dict.index&q=' + searchText,
            headers:{

            }
        }

        var body = '';
        var req = http.request(opt, function(res) {
            //console.log("Got response: " + res.statusCode);
            res.on('data',function(d){
                body += d;
            }).on('end', function(){
                //console.log(res.headers)
                //console.log(body)
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
            console.error("request word got error: " + e.message);
        })
        req.end();
    }


    var testFun = function(word){
        console.log(word);
    }

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
