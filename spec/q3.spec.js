var Promise = require('../src/promise.v3.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q2.spec.js");

describe("promise v3", function () {

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

});