function Promise(fun) {
    var pending = [],
        value;

    function resolve(_value) {
        value = _value;
        if (pending) {
            pending.forEach(function (callback) {
                callback(value);
            });

            pending = undefined;
        } else {
            throw new Error("A promise can only be resolved once !");
        }
    }

    function then(_callback) {
        if (pending) {
            pending.push(_callback);
        } else {
            _callback(value);
        }
    }

    fun && fun(resolve);

    return {
        then: then,
        resolve: resolve
    };
}

module.exports = Promise;