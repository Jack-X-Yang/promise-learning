var Promise = require('../src/promise.v2.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q1.spec.js");

describe("promise v2", function () {

    it("then chaining", function (done) {
        var promise = new Promise(function (resolve) {
            setTimeout(function () {
                resolve(123);
                done();
            }, 500);
        });



        promise.then(function (value) {
            expect(value).toBe(123);
            return "first then";
        }).then(function (value) {
            expect(value).toBe("first then");
        });
    });

});