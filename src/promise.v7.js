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
            then: function(callback) {
                var promise = new Promise();

                enqueue(function() {
                    promise.resolve(callback(value));
                });

                return promise;
            }
        };
    }

    function errRet(reason) {
        return {
            then: function(callback, errback) {
                var promise = new Promise();

                enqueue(function() {
                    promise.resolve(errback(reason));
                });

                return promise;
            }
        };
    }

    function done() {
        return undefined;
    }

    function resolve(_value) {
        value = ret(_value);
        if (pending) {
            pending.forEach(function(callback) {

                enqueue(function() {
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

        var callback = function(value) {
            try {
                promise.resolve(_callback(value));
            } catch (reason) {
                promise.reject(reason);
            }
        };

        var errback = function(reason) {
            try {
                promise.resolve(_errback(reason));
            } catch (reason) {
                promise.reject(reason);
            }
        };


        if (pending) {
            pending.push([callback, errback]);
        } else {
            enqueue(function() {
                value.then(callback, errback);
            });
        }

        return promise;
    }

    function isPromise(value) {
        return value && (typeof value.then == "function");
    }

    function all(promises) {
        var promise = new Promise();
        var promiseCount = 0;
        var resolvedPromiseCount = 0;
        var allResolvedValue = [];
        var isRejected = false;

        function callback(index) {
            return function(value) {
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

        promises.forEach(function(_promise, index) {
            if (!isRejected && isPromise(_promise)) {
                promiseCount++;
                _promise.then(callback(index), errback);
            } else {
                allResolvedValue[index] = _promise;
            }
        });

        return promise;
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

        promises.forEach(function(_promise) {
            if (!isResolved && isPromise(_promise)) {
                _promise.then(callback, errback);
                console.log(_promise);
            }
        });

        return promise;
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

// var p1 = new Promise(function(resolve, reject) { 
//     setTimeout(function() {
//         resolve("一");
//     }, 500); 
// });
// var p2 = new Promise(function(resolve, reject) { 
//     setTimeout(function() {
//         resolve("二");
//     }, 100); 
// });

// Promise.race([p1, p2]).then(function(value) {
//   console.log(value); // "二"
//   // 两个都解决，但p2更快
// });

// var p3 = new Promise(function(resolve, reject) { 
//     setTimeout(resolve, 100, "三");
// });
// var p4 = new Promise(function(resolve, reject) { 
//     setTimeout(reject, 500, "四"); 
// });

// Promise.race([p3, p4]).then(function(value) {
//   console.log(value); // "三"
//   // p3更快，所以被解决（resolve）了              
// }, function(reason) {
//   // 未被执行
// });

// var p5 = new Promise(function(resolve, reject) { 
//     setTimeout(resolve, 500, "五"); 
// });
// var p6 = new Promise(function(resolve, reject) { 
//     setTimeout(reject, 100, "六");
// });

// Promise.race([p5, p6]).then(function(value) {
//   // 未被执行             
// }, function(reason) {
//   console.log(reason); // "六"
//   // p6更快，所以被拒绝（reject了）
// });

var p7 = new Promise();
setTimeout(function() {
    p7.resolve(3);
}, 3000);

var p8 = new Promise();
setTimeout(function() {
    p8.reject(1);
}, 1000);

Promise.all([true, p7, p8])
    .then(values => {
        console.log(values); // [true, 3]
    }, reason => console.log(reason));

// module.exports = Promise;