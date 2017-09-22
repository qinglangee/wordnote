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

    // 使用jquery的方式已放弃
    // var jsdom = require('jsdom');
    // var $ = require('jquery')(jsdom.jsdom().parentWindow);
    
    var htmlparser = require("htmlparser");
    var select = require('soupselect').select;
    
    var St = require('../common/string_utils');
    var Log = require('../common/log_utils');
    var parserUtils = require('../common/htmlparser_utils');

    // 使用 htmlparser 解析页面内容
    _.parse = function(body){
        
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
            if (error)
                Log.e(error);
            else{
                // do nothing
                // Log.d("htmlparser no error");
            }
                
        },{ verbose: false, ignoreWhitespace: true });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
        // Log.d(body);
        
        var keyWordEles = select(handler.dom, ".keyword");
        var text = parserUtils.selfText(keyWordEles[0]);
        
        
        // 发音
        var pronounce = [];
        var pronName = select(handler.dom, ".pronounce");
        var pronText = select(handler.dom, ".phonetic");
        
        for(var i=0; i< pronName.length;i++){
            // $(pronText).remove();
            var pronNameValue = parserUtils.selfText(pronName[i]);
            var pron = {"name":St.trim(pronNameValue), "text":St.trim(parserUtils.selfText(pronText[i]))};
            pronounce[pronounce.length] = pron;
        }
        
        // 解释
        var translate = [];
        var transText = select(handler.dom, "#phrsListTab .trans-container ul li");
        for(var i = 0; i < transText.length; i++){
            translate[translate.length] = parserUtils.selfText(transText[i]);
        }
        // word 数据结构
        var word = {"text":text, "pronounce":pronounce, "translate":translate};
        Log.d("word is ====", word);
        return word;
    }
    
    // jquery 配合 jsdom 使用来解析 html 会造成内存泄漏, 所以改用了 htmlparser, 保留代码记念．．．
    _.parseUseJquery = function(bodyParser){
        
          //Log.i(res.headers)
          // Log.i("body is:", body)
          var html = $(body);
          单词
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
          return word;
    };






    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports.youdao_parser = _;
    } else {
        root.youdao_parser = _;
    }
}).call(this);
