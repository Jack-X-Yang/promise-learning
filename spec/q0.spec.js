var Promise = require('../src/promise.v0.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

describe("promise v0", function () {

    describe("promise properties", function () {

        it("should have then function", function () {
            var promise = new Promise();
            expect(typeof promise.then).toBe("function");
        });

        it("should have resolve function", function () {
            var promise = new Promise();
            expect(typeof promise.resolve).toBe("function");
        });

    });

    describe("promise uasge", function () {

        it("resolve and then worked will with pass in a function", function (done) {
            var promise = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(123);
                    done();
                }, 500);
            });

            promise.then(function (value) {
                expect(value).toBe(123);
            });
        });

        it("resolve and then worked will without paramter", function (done) {
            var promise = new Promise();

            setTimeout(function () {
                promise.resolve(123);
                done();
            }, 500);

            promise.then(function (value) {
                expect(value).toBe(123);
            });
        });

    });

});