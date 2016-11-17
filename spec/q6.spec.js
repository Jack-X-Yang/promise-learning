var Promise = require('../src/promise.v6.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q5.spec.js");

describe("promise v6", function () {

    describe("promise properties", function () {

        it("should have done function", function () {
            var promise = new Promise();
            expect(typeof promise.done).toBe("function");
        });

        it("should have catch function", function () {
            var promise = new Promise();
            expect(typeof promise.catch).toBe("function");
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

});