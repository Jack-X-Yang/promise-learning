var Promise = require('../src/promise.v4.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q3.spec.js");

describe("promise v4", function () {

    describe("promise properties", function () {

        it("should have reject function", function () {
            var promise = new Promise();
            expect(typeof promise.reject).toBe("function");
        });

    });

    describe("promise uasge", function () {

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