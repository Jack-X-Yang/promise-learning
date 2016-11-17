var Promise = require('../src/promise.v7.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q6.spec.js");

describe("promise v7", function () {

    describe("promise properties", function () {

        it("should have race function", function () {
            expect(typeof Promise.race).toBe("function");
        });

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
        }, function (reason) {});

        var p3 = new Promise(function (resolve, reject) {
            setTimeout(resolve, 500, 3);
        });
        var p4 = new Promise(function (resolve, reject) {
            setTimeout(reject, 100, 4);
        });

        Promise.race([p3, p4]).then(function (value) {}, function (reason) {
            expect(reason).toBe(4);
        });
    });

});