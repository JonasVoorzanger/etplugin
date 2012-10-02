// Generated by CoffeeScript 1.3.3
(function() {
  var root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = typeof global !== "undefined" && global !== null ? global : window;

  root.Chart = (function() {

    function Chart(options) {
      var view_class;
      if (options == null) {
        options = {};
      }
      this.refresh = __bind(this.refresh, this);

      this.gqueries = __bind(this.gqueries, this);

      if (options instanceof Element) {
        this.dom = $(options);
        this._gqueries = this.dom.data('etm-series').split(',');
        this.type = this.dom.data('etm-chart');
      } else {
        this._gqueries = options.series;
        this.type = options.type;
      }
      this._gqueries = this._gqueries || [];
      view_class = (function() {
        switch (this.type) {
          case 'stacked_bar':
            return StackedBarChart;
        }
      }).call(this);
      if (!view_class) {
        throw "Unsupported chart type";
      }
      this.view = new view_class(this.dom[0], this._gqueries);
    }

    Chart.prototype.gqueries = function() {
      return this._gqueries;
    };

    Chart.prototype.refresh = function(results) {
      return this.view.refresh(results);
    };

    return Chart;

  })();

  root.BaseChart = (function() {

    function BaseChart() {}

    return BaseChart;

  })();

  root.StackedBarChart = (function(_super) {

    __extends(StackedBarChart, _super);

    function StackedBarChart(dom, gqueries) {
      this.refresh = __bind(this.refresh, this);
      this.gqueries = gqueries;
      console.log('rendering');
      this.container = d3.select(dom).append('div');
      this.container.selectAll('div.item').data(this.gqueries, function(d) {
        return d;
      }).enter().append('div').attr('class', 'item').text(function(d) {
        return d;
      });
      this.rendered = true;
    }

    StackedBarChart.prototype.refresh = function(data) {
      if (data == null) {
        data = {};
      }
      console.log(data);
      if (!this.rendered) {
        this.render();
      }
      console.log('refreshing');
      return this.container.selectAll('div.item').data(this.gqueries, function(d) {
        return d;
      }).text(function(d) {
        return "" + d + ": " + data.results[d].future;
      });
    };

    return StackedBarChart;

  })(root.BaseChart);

}).call(this);
