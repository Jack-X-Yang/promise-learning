var Promise = require('../src/promise.v9.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q8.spec.js");

describe("promise v9", function () {

    describe("promise properties", function () {

        it("should have resolve function", function () {
            expect(typeof Promise.resolve).toBe("function");
        });

        it("should have reject function", function () {
            expect(typeof Promise.reject).toBe("function");
        });

    });

    describe("promise uasge", function () {

        it("return a resolved promise", function () {
            var promise = Promise.resolve(123);

            promise.then(function (value) {
                expect(value).toBe(123);
            });
        });

        it("return a rejected promise", function () {
            var promise = Promise.reject(456);

            promise.then(function (value) {}, function (reason) {
                expect(reason).toBe(456);
            });
        });

    });

});