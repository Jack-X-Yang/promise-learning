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
        var promise = new Promise();

        var callback = function (value) {
            promise.resolve(_callback(value));
        }

        if (pending) {
            pending.push(callback);
        } else {
            callback(value);
        }

        return promise;
    }

    fun && fun(resolve);

    return {
        then: then,
        resolve: resolve
    };
}

module.exports = Promise;