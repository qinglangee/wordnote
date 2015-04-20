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

    // 常量
    _.NL = '\n';   // 新行, new line


    // 函数

    // 空串判断
    _.isEmpty = function(str){
        return (str === null || str === "");
    }

    _.trim = function(str){ //删除左右两端的空格
        if(str == null)
            return str;
　　     return str.replace(/(^\s*)|(\s*$)/g, "");
　　 }
　　 _.ltrim = function(str){ //删除左边的空格
        if(str == null)
            return str;
　　     return str.replace(/(^\s*)/g,"");
　　 }
　　 _.rtrim = function(str){ //删除右边的空格
        if(str == null)
            return str;
　　     return str.replace(/(\s*$)/g,"");
　　 }

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports.StringUtils = _;
    } else {
        root.StringUtils = _;
    }
}).call(this);
