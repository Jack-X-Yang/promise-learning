var Promise = require('../src/promise.v5.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
require("./q4.spec.js");

describe("promise v5", function () {

    it("then can call many times", function (done) {
        var promise = new Promise(oneSecondLater);
        var then1 = jasmine.createSpy("then1");
        var then2 = jasmine.createSpy("then2");

        function oneSecondLater(resolve) {
            setTimeout(function () {
                resolve(123);
                setTimeout(function () {
                    done();
                    expect(then1).toHaveBeenCalled();
                    expect(then2).toHaveBeenCalled();
                }, 300);
            }, 500);
        }

        promise.then(then1);
        promise.then(then2);

    });

});