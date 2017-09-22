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


    var St = require('./string_utils');

    // 取自己元素下的文本内容
    _.selfText = function(rootElement){
        if(rootElement == null){
            return "";
        }
        var children = rootElement.children;
        if(children == null || children.length < 1){
            return "";
        }
        
        var text = "";
        for(var i=0;i<children.length;i++){
            var child = children[i];
            if(child.type == "text"){
                text += child.data;
            }
        }
        return St.trim(text);
    }
    // 删除元素中指定类型的元素，（例如删掉div中的span）
    _.removeType = function(rootElement, typeName){
        if(rootElement == null){
            return rootElement;
        }
        var children = rootElement.children;
        if(children == null || children.length < 1){
            return rootElement;
        }
        
        var removeIndex = [];
        for(var i=0;i<children.length;i++){
            var child = children[i];
            if(child.type == typeName){
                removeIndex.push(i);
            }
        }
        
        for(var i=removeIndex.length;i>0;i--){
            children.splice(i-1,1);
        }
        return rootElement;
        
    }

    



    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports.HtmlParserUtils = _;
    } else {
        root.HtmlParserUtils = _;
    }
}).call(this);
