function Promise(fun) {
    var pending = [],
        value;

    function enqueue(callback) {
        setTimeout(callback, 1);
    }

    function ret(value) {
        if (value && typeof value.then == "function")
            return value;
        return {
            then: function (callback) {
                var promise = new Promise();

                enqueue(function () {
                    promise.resolve(callback(value));
                });

                return promise;
            }
        };
    }

    function errRet(reason) {
        return {
            then: function (callback, errback) {
                var promise = new Promise();

                enqueue(function () {
                    promise.resolve(errback(reason));
                });

                return promise;
            }
        };
    }

    function resolve(_value) {
        value = ret(_value);
        if (pending) {
            pending.forEach(function (callback) {

                enqueue(function () {
                    value.then.apply(value, callback);
                });

            });

            pending = undefined;
        } else {
            throw new Error("A promise can only be resolved once !");
        }
    }

    function reject(reason) {
        resolve(errRet(reason));
    }

    function then(_callback, _errback) {
        var promise = new Promise();

        _callback || function _callback(value) {
            return value;
        };

        _errback || function _errback(reason) {
            return errRet(reason);
        };

        var callback = function (value) {
            try {
                promise.resolve(_callback(value));
            } catch (reason) {
                promise.reject(reason);
            }
        };

        var errback = function (reason) {
            try {
                promise.resolve(_errback(reason));
            } catch (reason) {
                promise.reject(reason);
            }
        };


        if (pending) {
            pending.push([callback, errback]);
        } else {
           enqueue(function () {
                value.then(callback, errback);
           });
        }

        return promise;
    }

    fun && fun(resolve, reject);

    return {
        then: then,
        resolve: resolve,
        reject: reject
    };
}

module.exports = Promise;