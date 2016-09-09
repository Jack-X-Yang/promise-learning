var Promise = require('../src/promise.v8.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

describe("promise v8", function () {

    describe("promise properties", function () {

        it("should have then function", function () {
            var promise = new Promise();
            expect(typeof promise.then).toBe("function");
        });

        it("should have resolve function", function () {
            var promise = new Promise();
            expect(typeof promise.resolve).toBe("function");
        });

        it("should have reject function", function () {
            var promise = new Promise();
            expect(typeof promise.reject).toBe("function");
        });

        it("should have done function", function () {
            var promise = new Promise();
            expect(typeof promise.done).toBe("function");
        });

        it("should have catch function", function () {
            var promise = new Promise();
            expect(typeof promise.catch).toBe("function");
        });

        it("should have race function", function () {
            expect(typeof Promise.race).toBe("function");
        });

        it("should have all function", function () {
            expect(typeof Promise.all).toBe("function");
        });

    });

    describe("promise uasge", function () {

        it("resolve and then worked will with pass in a function", function (done) {
            var promise = new Promise(oneSecondLater);

            function oneSecondLater(resolve) {
                setTimeout(function () {
                    resolve(123);
                    done();
                }, 500);
            }

            promise.then(function (value) {
                expect(value).toBe(123);
            });
        });

        it("resolve and then worked will without paramter", function (done) {
            var promise = new Promise();

            (function oneSecondLater(resolve) {
                setTimeout(function () {
                    resolve(123);
                    done();
                }, 500);
            })(promise.resolve);

            promise.then(function (value) {
                expect(value).toBe(123);
            });
        });

        it("reject and then worked will with pass in a function", function (done) {
            var promise = new Promise(oneSecondLater);

            function oneSecondLater(resolve, reject) {
                setTimeout(function () {
                    reject(123);
                    done();
                }, 500);
            }

            promise.then(function () { }, function (reason) {
                expect(reason).toBe(123);
            });
        });

        it("reject and then worked will without paramter", function (done) {
            var promise = new Promise();

            (function oneSecondLater(resolve, reject) {
                setTimeout(function () {
                    reject(123);
                    done();
                }, 500);
            })(promise.resolve, promise.reject);

            promise.then(function () { }, function (reason) {
                expect(reason).toBe(123);
            });
        });

    });

    it("then can call many times", function (done) {
        var promise = new Promise(oneSecondLater);
        var then1 = jasmine.createSpy("then1");
        var then2 = jasmine.createSpy("then2");

        function oneSecondLater(resolve) {
            setTimeout(function () {
                resolve(123);
                setTimeout(function () {
                    done();
                    expect(then1).toHaveBeenCalled();
                    expect(then2).toHaveBeenCalled();
                }, 300);
            }, 500);
        }

        promise.then(then1);
        promise.then(then2);

    });

    it("when resolved the then function still work", function (done) {
        var promise = new Promise(rightNow);

        function rightNow(resolve) {
            resolve(123);
        }

        promise.then(function (value) {
            expect(value).toBe(123);
        });

        setTimeout(function () {
            promise.then(function (value) {
                expect(value).toBe(123);
            });
            done();
        }, 800);

    });

    it("can only resolved once", function (done) {
        var promise = new Promise(oneSecondLater);

        function oneSecondLater(resolve) {
            setTimeout(function () {
                expect(function () {
                    resolve(123);
                }).toThrow(new Error("A promise can only be resolved once !"));
                done();
            }, 500);

            resolve(123);
        }

        promise.then(function (value) {
            expect(value).toBe(123);
        });

    });

    it("then chaining", function (done) {
        var promise = new Promise(oneSecondLater);

        function oneSecondLater(resolve) {
            setTimeout(function () {

                resolve(123);
                done();
            }, 500);
        }

        promise.then(function (value) {
            expect(value).toBe(123);
            return "first then";
        }).then(function (value) {
            expect(value).toBe("first then");
        });
    });

    it("resolve can accept a promise object", function () {
        var promise1 = new Promise();
        var promise2 = new Promise();

        promise1.resolve(123);

        promise1.then(function (value) {
            expect(value).toBe(123);
            return value;
        });

        promise2.resolve(promise1);

        promise2.then(function (value) {
            expect(value).toBe(123);
        });
    });

    it("then chaining with reject", function (done) {
        var promise = new Promise(oneSecondLater);

        function oneSecondLater(resolve) {
            setTimeout(function () {

                resolve(123);
                done();
            }, 500);
        }

        promise.then(function (value) {
            expect(value).toBe(123);
            throw "reject";
        }).then(function (value) { }, function (reason) {
            expect(reason).toBe("reject");
            return 1234;
        }).then(function (value) {
            expect(value).toBe(1234);
        });
    });

    it("catch the throw", function () {
        var promise = new Promise(function (resolve, reject) {
            reject(123);
        });

        promise.catch(function (reason) {
            expect(reason).toBe(123);
        });
    });

    it("done method return undefined", function () {
        var promise = new Promise(function (resolve, reject) {
            resolve(123);
        });

        var done = promise.then(function (value) {
            expect(value).toBe(123);
        }).done();

        expect(done).toBeUndefined();
    });

    it("race return first resolved value when two promise resolve in turn", function () {
        var p1 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(1);
            }, 500);
        });

        var p2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(2);
            }, 100);
        });

        Promise.race([p1, p2]).then(function (value) {
            expect(value).toBe(2);
        });
    });

    it("race return first resolved or rejected value", function () {
        var p1 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 100, 1);
        });
        var p2 = new Promise(function (resolve, reject) {
            setTimeout(reject, 500, 2);
        });

        Promise.race([p1, p2]).then(function (value) {
            expect(value).toBe(2);
        }, function (reason) { });

        var p3 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 3);
        });
        var p4 = new Promise(function (resolve, reject) {
            setTimeout(reject, 100, 4);
        });

        Promise.race([p3, p4]).then(function (value) { }, function (reason) {
            expect(reason).toBe(4);
        });
    });

    it("all method return all resolved value", function () {
        var promise = new Promise();
        promise.resolve(3);
        Promise.all([true, promise])
            .then(function(values) {
                expect(values).toContain(true);
                expect(values).toContain(3);
            });
    });

    it("all method reject when one promise is rejected", function() {
        var p1 = new Promise();
        var p2 = new Promise(function(resolve, reject) {
            setTimeout(reject, 100, 456);
        });

        p1.resolve(123);

        Promise.all([p1, p2]).then(function(value) {

        }, function(reason) {
            expect(reason).toBe(456);
        });
    });

});