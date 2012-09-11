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
        this.etm = $('#scenario1').etmodel()[0];
        return this.etm.__call_api__ = function() {};
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
      it("should find inputs and outputs", function() {
        assert.equal(2, this.etm.inputs.length);
        return assert.equal(2, this.etm.outputs.length);
      });
      return it("should assign api_path correctly", function() {
        var etm;
        etm = $('#scenario1').etmodel({
          api_path: 'http://beta.et-engine.com'
        })[0];
        return assert.equal('http://beta.et-engine.com/api/v3/', etm.api.path(''));
      });
    });
    describe('integration', function() {
      before(function() {});
      return it("when you change a slider it call before and afterLoading", function(done) {
        this.etm = $('#scenario1').etmodel({
          beforeLoading: (function() {
            return done();
          }),
          afterLoading: (function() {
            return done();
          })
        })[0];
        $(this.etm.inputs[0]).trigger('change');
        return done();
      });
    });
  }

  describe('ApiGateway', function() {
    var make_api;
    make_api = function(url) {
      return new ApiGateway({
        api_path: url
      });
    };
    describe('api_path', function() {
      it("should assign api_path correctly and catch commong mistakes", function() {
        assert.equal('http://beta.et-engine.com/api/v3/', make_api('http://beta.et-engine.com').path(''));
        assert.equal('http://etengine.dev/api/v3/', make_api('http://etengine.dev/').path(''));
        assert.equal('http://etengine.dev/api/v3/', make_api('etengine.dev/').path(''));
        return assert.equal('https://etengine.dev/api/v3/', make_api('https://etengine.dev/').path(''));
      });
      it("can only call setPath ones", function() {
        var api;
        api = new ApiGateway({
          api_path: 'http://beta.et-engine.com'
        });
        api.setPath('http://www.et-engine.com/');
        return assert.equal('http://beta.et-engine.com/api/v3/', api.path(''));
      });
      it("should flag isBeta if it's beta server", function() {
        assert.equal(true, make_api('http://beta.et-engine.com').isBeta);
        assert.equal(false, make_api('http://www.et-engine.com').isBeta);
        return assert.equal(false, make_api('http://etengine.dev').isBeta);
      });
      it("assigns default options to scenario", function() {
        var api;
        api = new ApiGateway();
        assert.equal(null, api.scenario_id);
        return assert.equal(false, api.opts.offline);
      });
      it("overwrites default options", function() {
        var api;
        api = new ApiGateway({
          scenario_id: 1234,
          offline: true
        });
        assert.equal(1234, api.scenario_id);
        return assert.equal(true, api.opts.offline);
      });
      return describe('cors support', function() {
        after(function() {
          return jQuery.support.cors = true;
        });
        it("calls proxy server when offline: true", function() {
          jQuery.support.cors = false;
          assert.equal('/ete/api/v3/', new ApiGateway({
            api_path: 'ete.dev',
            offline: true
          }).path(''));
          return assert.equal('/ete/api/v3/', new ApiGateway({
            api_path: 'ete.dev',
            offline: false
          }).path(''));
        });
        return it("calls proxy server when offline: true", function() {
          jQuery.support.cors = true;
          assert.equal('/ete/api/v3/', new ApiGateway({
            api_path: 'ete.dev',
            offline: true
          }).path(''));
          return assert.notEqual('/ete/api/v3/', new ApiGateway({
            api_path: 'ete.dev',
            offline: false
          }).path(''));
        });
      });
    });
    return describe('API with etsource fixtures', function() {
      before(function() {
        return this.api = new ApiGateway({
          api_path: 'http://localhost:3000'
        });
      });
      it("#ensure_id() fetches new id", function(done) {
        var api;
        api = this.api;
        return api.ensure_id().done(function(id) {
          assert.equal(true, typeof id === 'number');
          assert.equal(id, api.scenario_id);
          return done();
        });
      });
      it("#update queries: ['foo_demand'])", function(done) {
        var _this = this;
        return this.api.ensure_id().done(function(id) {
          return _this.api.update({
            queries: ['foo_demand'],
            success: function(data) {
              assert.equal(true, typeof data.results.foo_demand.present === 'number');
              return done();
            }
          });
        });
      });
      it("#update inputs: foo_demand with valid number updates future demand by that number", function(done) {
        return this.api.update({
          inputs: {
            'foo_demand': 3.0
          },
          queries: ['foo_demand'],
          success: function(data) {
            assert.ok(data);
            return done();
          }
        });
      });
      it("#update success: callback gets {results,inputs,settings}", function(done) {
        return this.api.update({
          inputs: {
            'foo_demand': 3.0
          },
          queries: ['foo_demand'],
          success: function(_arg) {
            var inputs, results, settings;
            results = _arg.results, inputs = _arg.inputs, settings = _arg.settings;
            assert.ok(results);
            assert.ok(results.foo_demand);
            assert.ok(inputs);
            assert.ok(settings);
            return done();
          }
        });
      });
      it("#update inputs: foo_demand with valid number updates future demand by that number", function(done) {
        return this.api.update({
          inputs: {
            'foo_demand': 3.0
          },
          queries: ['foo_demand'],
          success: function(data) {
            assert.ok(data);
            return done();
          }
        });
      });
      it("#update inputs: foo_demand with invalid number calls the supplied error callback", function(done) {
        return this.api.update({
          inputs: {
            'foo_demand': -1.0
          },
          error: function(data) {
            assert.ok(data);
            return done();
          },
          success: function(data) {
            assert.ok(false);
            return done();
          }
        });
      });
      return it("#user_values", function(done) {
        return this.api.user_values({
          success: function(data) {
            assert.ok(data);
            assert.ok(data.foo_demand.min < data.foo_demand.max);
            return done();
          }
        });
      });
    });
  });

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
