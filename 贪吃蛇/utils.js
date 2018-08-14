var utils = {
    extends: function (parent) {
        var result = function () {
            parent.apply(this, arguments);
        }
        var Super = function() {};
        Super.prototype = parent.prototype;
        result.prototype = new Super();
        return result;
    },
    Singleton: function () {
        var result = function () {
            if (typeof result.instance === 'object') {
                return result.instance;
            } else {
                result.instance = this;
                return this;
            }
        }
        return result;
    }
}