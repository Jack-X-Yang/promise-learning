var Promise = require('../src/promise.v4.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

describe("promise v4", function () {

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

            promise.then(function () {}, function (reason) {
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

            promise.then(function () {}, function (reason) {
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
                done();
                expect(then1).toHaveBeenCalled();
                expect(then2).toHaveBeenCalled();
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
        }).then(function (value) {}, function (reason) {
            expect(reason).toBe("reject");
            return 1234;
        }).then(function (value) {
            expect(value).toBe(1234);
        });
    });

});