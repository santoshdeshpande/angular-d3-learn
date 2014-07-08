/* global
 define: false,
 console: false
 */
define([
  'd3',
  './chart'
], function ( d3, Chart ) {
  'use strict';

  return ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        bars: '=',
      },
      link: function (scope, ele, attrs) {
        var renderTimeout;
        var dimensions = { margins: { top: 10, right: 20, bottom: 10, left: 40 } };

        var svg = new Chart(ele[0], dimensions);

        var x = d3.scale.ordinal().rangeRoundBands([0, svg.width()], .1);
        var y = d3.scale.linear().range([svg.height(), 0]);
        var yAxis = d3.svg.axis().scale(y).orient('left');

        scope.$watch('bars', function (newBars) {
          if (newBars != null) scope.render(newBars);
        }, true);

        scope.render = function (data) {
          svg.selectAll('*').remove();

          if (!data) return;
          if (renderTimeout) $timeout.cancel(renderTimeout);

          renderTimeout = $timeout(function () {
            x.domain(data.map(function (d) { return d[0] }));
            y.domain([0, d3.max(data, function (d) { return d[1] })]);

            var yTicks = [
              d3.min(y.ticks()),
              d3.mean(y.ticks()),
              d3.max(y.ticks())
            ];

            yAxis.tickValues(yTicks);
            svg.append('g')
                  .attr('class', 'y axis')
                  .call(yAxis);

            var barContainers = svg.selectAll('.bar')
                  .data(data)
                .enter().append('g')
                  .attr('class', 'bar')
                  .attr('y', svg.height())
                  .attr('height', 0);

            var bars = barContainers.append('rect')
              .attr('class', 'bar')
              .attr('y', svg.height())
              .attr('height', 0);

            bars.transition()
              .duration( 500 )
              .delay( function ( d, i ) {
                 return i * 20;
               })
              .attr('x', function(d) { return x(d[0]); })
              .attr('width', x.rangeBand())
              .attr('y', function(d) { return y(d[1]); })
              .attr('height', function(d) { return svg.height() - y(d[1]) });

            var barValueLabel = svg.append('g')
                .attr('transform', 'translate(' + svg.width() / 2 + ', 10)')
              .append('text')
                .attr('class', 'bar-value-label')
                .style('text-anchor', 'middle');

          }, 200); // renderTimeout
        };
      }
    };
  }]
});
