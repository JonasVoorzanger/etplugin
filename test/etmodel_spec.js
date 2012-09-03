// Generated by CoffeeScript 1.3.3
(function() {
  var ApiGateway, Etmodel, assert, root;

  root = typeof global !== "undefined" && global !== null ? global : window;

  if (typeof require !== "undefined" && require !== null) {
    assert = require("assert");
    Etmodel = require('../vendor/assets/javascripts/jquery.etmodel.js').Etmodel;
    ApiGateway = require('../vendor/assets/javascripts/jquery.etmodel.js').ApiGateway;
  } else {
    Etmodel = root.Etmodel;
    ApiGateway = root.ApiGateway;
    assert = root.assert;
  }

  if (typeof $ !== "undefined" && $ !== null) {
    describe("$().etmodel()", function() {
      before(function() {
        ApiGateway.prototype.call_api = function() {};
        return this.etm = $('#scenario1').etmodel()[0];
      });
      it("should assign default settings", function() {
        this.etmdefault = $('#scenario-defaults').etmodel()[0];
        assert.equal('nl', this.etmdefault.settings.area_code);
        return assert.equal('2050', this.etmdefault.settings.end_year);
      });
      it("should overwrite settings", function() {
        assert.equal('de', this.etm.settings.area_code);
        return assert.equal('2030', this.etm.settings.end_year);
      });
      return it("should find inputs", function() {
        return assert.equal(2, this.etm.inputs.length);
      });
    });
  }

  describe('Etmodel.ResultFormatter', function() {
    var format_result, result;
    format_result = function(value, format) {
      return new Etmodel.ResultFormatter(value, format).value();
    };
    result = function(present, future) {
      return {
        present: present,
        future: future
      };
    };
    before(function() {
      return this.res = result(10, 15);
    });
    it("should round future value by default", function() {
      return assert.equal(2.1, format_result(result(0, 2.1234)));
    });
    it("should round", function() {
      assert.equal(1.2, format_result(1.234, 'round'));
      assert.equal(1.0, format_result(1.234, 'round:0'));
      assert.equal(1.2, format_result(1.234, 'round:1'));
      assert.equal(1.23, format_result(1.234, 'round:2'));
      return assert.equal(1230.0, format_result(1234.234, 'round:-1'));
    });
    it("should fetch present|future", function() {
      assert.equal(10, format_result(this.res, 'present'));
      return assert.equal(15, format_result(this.res, 'future'));
    });
    it("should calculate delta", function() {
      assert.equal((15 / 10) - 1, format_result(this.res, 'delta'));
      return assert.equal(0, format_result(result(0, 0), 'delta'));
    });
    return it("should chain format strings", function() {
      assert.equal(0.5, format_result(this.res, 'delta'));
      assert.equal(50, format_result(this.res, 'delta;percent'));
      return assert.equal(28.6, format_result(result(7, 9), 'delta;percent;round:1'));
    });
  });

}).call(this);
