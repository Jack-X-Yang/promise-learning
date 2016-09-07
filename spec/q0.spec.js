var Promise = require('../src/promise.v0.js');

describe("promise v0", function() {

    describe("promise properties", function() {

        it("should have then function", function() {
            var promise = new Promise();
            expect(typeof promise.then).toBe("function");
        });

        it("should have resolve function", function() {
            var promise = new Promise();
            expect(typeof promise.resolve).toBe("function");
        });

    });

    describe("promise uasge", function() {

        it("resolve and then worked will with pass in a function", function(done) {
            var promise = new Promise(oneSecondLater);

            function oneSecondLater(resolve) {
                setTimeout(function() {
                    resolve(123);
                    done();
                }, 1000);
            }

            promise.then(function(value) {
                expect(value).toBe(123);
            });
        });

        it("resolve and then worked will without paramter", function(done) {
            var promise = new Promise();

            (function oneSecondLater(resolve) {
                setTimeout(function() {
                    resolve(123);
                    done();
                }, 1000);
            })(promise.resolve);

            promise.then(function(value) {
                expect(value).toBe(123);
            });
        });

    });

});
