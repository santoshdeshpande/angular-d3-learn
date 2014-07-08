/* global
 define: false,
 console: false
 */
define([
  'd3',
  './chart'
], function (d3, Chart) {
  'use strict';

  return ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      scope: {
        pie: '='
      },
      link: function (scope, ele, attrs) {
        var renderTimeout;

        var dimensions = {
          margins: { top: 0, right: 0, bottom: 10, left: 0 }
        };
        var svg = new Chart(ele[0], dimensions);
        var radius = Math.min(svg.width(), svg.height()) / 2;

        scope.$watch('pie', function ( newPie ) {
          if (newPie != null) scope.render(newPie);
        }, true);

        scope.render = function ( data ) {
          svg.selectAll('*').remove();

          if (!data) return;
          if (renderTimeout) $timeout.cancel(renderTimeout);

          console.log(data); // just checking if data arrives here

          renderTimeout = $timeout(function () {
            // implement me
          }, 200); // renderTimeout
        };
      }
    };
  }]
});
