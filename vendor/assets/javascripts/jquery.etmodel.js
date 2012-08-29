// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Etmodel = (function() {

    function Etmodel() {
      var _this = this;
      this.api = new ApiGateway();
      this.inputs = $('[data-etm-input]');
      this.inputs.bind('change', function() {
        return _this.update();
      });
      this.outputs = $('[data-etm-output]').each(function(i, el) {
        return $(el).html('...');
      });
    }

    Etmodel.prototype.update = function() {
      var inputs, query_keys;
      inputs = {};
      this.inputs.each(function(i, el) {
        return inputs[$(el).attr('data-etm-input')] = $(el).val();
      });
      query_keys = ['dashboard_total_costs'];
      return this.api.update({
        inputs: inputs,
        queries: query_keys,
        success: this.handle_result
      });
    };

    Etmodel.prototype.handle_result = function(data) {
      var key, values, _ref, _results;
      _ref = data.results;
      _results = [];
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        values = _ref[key];
        _results.push($("[data-etm-output=" + key + "]").each(function(i, el) {
          var period, unit, value;
          period = $(el).attr('data-etm-period') || 'future';
          value = period === 'delta_percent' ? Math.round((values.future / values.present - 1.0) * 100) : values[period];
          value = Util.round(value, $('el').attr('data-round') || 1);
          unit = values.unit;
          return $(el).html("" + value);
        }));
      }
      return _results;
    };

    return Etmodel;

  })();

  this.Util = (function() {

    function Util() {}

    Util.round = function(value, n) {
      var multiplier;
      multiplier = Math.pow(10, n);
      if (n > 0) {
        return Math.round(value * multiplier) / multiplier;
      } else if (n.zero()) {
        return Math.round(value);
      } else {
        return Math.round(value * multiplier) / multiplier;
      }
    };

    return Util;

  })();

  this.ApiGateway = (function() {
    var PATH, VERSION;

    PATH = null;

    VERSION = '0.1';

    ApiGateway.queue = [];

    ApiGateway.prototype.scenario_id = null;

    ApiGateway.prototype.isBeta = false;

    ApiGateway.prototype.default_options = {
      api_path: 'http://beta.et-engine.com',
      offline: false,
      log: true,
      beforeLoading: function() {},
      afterLoading: function() {},
      defaultErrorHandler: function() {
        console.log("ApiGateway.update Error:");
        return console.log(arguments);
      }
    };

    function ApiGateway(opts) {
      this.user_values = __bind(this.user_values, this);
      this.opts = $.extend({}, this.default_options, opts);
      this.settings = this.pickSettings(this.opts);
      this.scenario_id = this.opts.scenario_id || null;
      this.setPath(this.opts.api_path, this.opts.offline);
    }

    ApiGateway.prototype.ensure_id = function() {
      var id,
        _this = this;
      if (this.deferred_scenario_id) {
        return this.deferred_scenario_id;
      }
      if (id = this.scenario_id) {
        this.deferred_scenario_id = $.Deferred().resolve(id);
      } else {
        this.deferred_scenario_id = $.ajax({
          url: this.path("scenarios"),
          type: 'POST',
          data: {
            scenario: this.settings
          },
          timeout: 10000,
          error: this.opts.defaultErrorHandler
        }).pipe(function(d) {
          return d.id;
        });
        this.deferred_scenario_id.done(function(id) {
          return _this.scenario_id = id;
        });
      }
      return this.deferred_scenario_id;
    };

    ApiGateway.prototype.changeScenario = function(_arg) {
      var attributes, error, success;
      attributes = _arg.attributes, success = _arg.success, error = _arg.error;
      return this.settings = $.extend(this.settings, this.pickSettings(attributes));
    };

    ApiGateway.prototype.resetScenario = function() {};

    ApiGateway.prototype.update = function(_arg) {
      var error, inputs, queries, settings, success,
        _this = this;
      inputs = _arg.inputs, queries = _arg.queries, success = _arg.success, error = _arg.error, settings = _arg.settings;
      return this.ensure_id().done(function() {
        var params, success_callback, url;
        error || (error = _this.opts.defaultErrorHandler);
        params = {
          autobalance: true,
          scenario: {
            user_values: inputs
          }
        };
        if (queries != null) {
          params.gqueries = queries;
        }
        if (settings != null) {
          params.settings = settings;
        }
        url = _this.path("scenarios/" + _this.scenario_id);
        success_callback = function(data, textStatus, jqXHR) {
          var parsed_results;
          parsed_results = _this.__parse_success__(data, textStatus, jqXHR);
          return success(parsed_results, data, textStatus, jqXHR);
        };
        return _this.__call_api__(url, params, success_callback, error);
      });
    };

    ApiGateway.prototype.user_values = function(_arg) {
      var error, success,
        _this = this;
      success = _arg.success, error = _arg.error;
      return this.ensure_id().done(function() {
        return $.ajax({
          url: _this.path("scenarios/" + _this.scenario_id + "/inputs.json"),
          success: success,
          dataType: 'json',
          timeout: 15000
        });
      });
    };

    ApiGateway.prototype.__parse_success__ = function(data, textStatus, jqXHR) {
      var key, result, values, _ref, _ref1;
      result = {
        results: {},
        inputs: (_ref = data.settings) != null ? _ref.user_values : void 0,
        settings: data.settings || {}
      };
      _ref1 = data.gqueries;
      for (key in _ref1) {
        if (!__hasProp.call(_ref1, key)) continue;
        values = _ref1[key];
        result.results[key] = values;
      }
      return result;
    };

    ApiGateway.prototype.__call_api__ = function(url, params, success, error, ajaxOptions) {
      var afterLoading, opts;
      if (ajaxOptions == null) {
        ajaxOptions = {};
      }
      opts = $.extend({
        url: url,
        data: params,
        type: 'PUT',
        dataType: 'json',
        timeout: 10000,
        headers: {
          'X-Api-Agent': "jQuery.etmodel " + VERSION
        }
      }, ajaxOptions);
      this.opts.beforeLoading();
      ApiGateway.queue.push('call_api');
      afterLoading = this.opts.afterLoading;
      return jQuery.ajaxQueue(opts).done(function(data, textStatus, jqXHR) {
        ApiGateway.queue.pop();
        if (ApiGateway.queue.length === 0) {
          afterLoading();
        }
        return success(data, textStatus, jqXHR);
      }).fail(function(jqXHR, textStatus, error) {
        ApiGateway.queue.pop();
        if (ApiGateway.queue.length === 0) {
          afterLoading();
        }
        return error(jqXHR, textStatus, error);
      });
    };

    ApiGateway.prototype.pickSettings = function(hsh) {
      var key, result, _i, _len, _ref;
      result = {};
      _ref = ['area_code', 'end_year', 'preset_id', 'use_fce'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        result[key] = hsh[key];
      }
      return result;
    };

    ApiGateway.prototype.setPath = function(path, offline) {
      var ios4, _ref;
      if (offline == null) {
        offline = false;
      }
      ios4 = (_ref = navigator.userAgent) != null ? _ref.match(/CPU (iPhone )?OS 4_/) : void 0;
      PATH = jQuery.support.cors && !ios4 && !offline ? path : '/ete';
      this.isBeta = path.match(/^https?:\/\/beta\./) != null;
      return this.setPath = (function() {});
    };

    ApiGateway.prototype.path = function(suffix) {
      return "" + PATH + "/api/v3/" + suffix;
    };

    return ApiGateway;

  })();

}).call(this);
