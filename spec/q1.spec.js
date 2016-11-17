var Promise = require('../src/promise.v1.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q0.spec.js");

describe("promise v1", function () {

    it("then can call many times", function (done) {
        var then1 = jasmine.createSpy("then1");
        var then2 = jasmine.createSpy("then2");

        var promise = new Promise(function (resolve) {
            setTimeout(function () {
                resolve(123);
                done();
                expect(then1).toHaveBeenCalled();
                expect(then2).toHaveBeenCalled();
            }, 500);
        });

        promise.then(then1);
        promise.then(then2);

    });

    it("when resolved the then function still work", function (done) {
        var promise = new Promise(function (resolve) {
            resolve(123);
        });

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
        var promise = new Promise(function (resolve) {
            setTimeout(function () {
                expect(function () {
                    resolve(123);
                }).toThrow(new Error("A promise can only be resolved once !"));
                done();
            }, 500);

            resolve(123);
        });

        promise.then(function (value) {
            expect(value).toBe(123);
        });

    });

});