var Promise = require('../src/promise.v8.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q7.spec.js");

describe("promise v8", function () {

    describe("promise properties", function () {

        it("should have all function", function () {
            expect(typeof Promise.all).toBe("function");
        });

    });

    it("all method return all resolved value", function () {
        var promise = new Promise();
        promise.resolve(3);
        Promise.all([true, promise])
            .then(function (values) {
                expect(values).toContain(true);
                expect(values).toContain(3);
            });
    });

    it("all method reject when one promise is rejected", function () {
        var p1 = new Promise();
        var p2 = new Promise(function (resolve, reject) {
            setTimeout(reject, 100, 456);
        });

        p1.resolve(123);

        Promise.all([p1, p2]).then(function (value) {

        }, function (reason) {
            expect(reason).toBe(456);
        });
    });

});