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

    function isPromise(value) {
        return value && (typeof value.then == "function");
    }

    function race(promises) {
        var promise = new Promise();
        var isResolved = false;

        function callback(value) {
            if (!isResolved) {
                promise.resolve(value);
                isResolved = true;
            }
        }

        function errback(reason) {
            if (!isResolved) {
                promise.reject(reason);
                isResolved = true;
            }
        }

        promises.forEach(function (_promise) {
            if (!isResolved && isPromise(_promise)) {
                _promise.then(callback, errback);
            }
        });

        return promise;
    }

    function all(promises) {
        var promise = new Promise();
        var promiseCount = 0;
        var resolvedPromiseCount = 0;
        var allResolvedValue = [];
        var isRejected = false;

        function callback(index) {
            return function (value) {
                resolvedPromiseCount++;
                allResolvedValue[index] = value;
                if (promiseCount == resolvedPromiseCount) {
                    promise.resolve(allResolvedValue);
                    resolvedPromiseCount = 0;
                }
            };
        }

        function errback(reason) {
            if (isRejected) {
                return;
            } else {
                isRejected = true;
                promise.reject(reason);
            }
        }

        promises.forEach(function (_promise, index) {
            if (!isRejected && isPromise(_promise)) {
                promiseCount++;
                _promise.then(callback(index), errback);
            } else {
                allResolvedValue[index] = _promise;
            }
        });

        return promise;
    }


    function done() {
        return undefined;
    }

    function _catch(callback) {
        return then(null, callback);
    }

    fun && fun(resolve, reject);

    Promise.race = race;
    Promise.all = all;
    Promise.resolve = function (value) {
        var promise = new Promise();
        promise.resolve(value);
        return promise;
    };
    Promise.reject = function (reason) {
        var promise = new Promise();
        promise.reject(reason);
        return promise;
    };

    return {
        then: then,
        resolve: resolve,
        reject: reject,
        done: done,
        "catch": _catch
    };
}

module.exports = Promise;