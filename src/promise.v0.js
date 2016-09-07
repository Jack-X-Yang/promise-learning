function Promise(fun) {
    var callback, value;

    function resolve(_value) {
        value = _value;
        callback(value);
    }

    function then(_callback) {
        callback = _callback;
    }

    fun && fun(resolve);

    return {
        then: then,
        resolve: resolve
    };
}

module.exports = Promise;