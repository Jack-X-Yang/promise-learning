function Promise(fun) {
    var pending = [],
        value;

    function ret(value) {
        if (value && typeof value.then == "function")
            return value;
        return {
            then: function (callback) {
                var promsie = new Promise();

                promsie.resolve(callback(value));

                return promsie;
            }
        };
    }

    function resolve(_value) {
        value = ret(_value);
        if (pending) {
            pending.forEach(function (callback) {
                value.then(callback);
            });

            pending = undefined;
        } else {
            throw new Error("A promise can only be resolved once !");
        }
    }

    function then(_callback, _errback) {
        var promise = new Promise();

        _callback || function _callback() {
            return value;
        }

        var callback = function (value) {
            promise.resolve(_callback(value));
        }


        if (pending) {
            pending.push(callback);
        } else {
            value.then(callback);
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