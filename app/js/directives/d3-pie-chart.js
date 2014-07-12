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
                pie: '=',
                title: '@'
            },
            link: function (scope, ele, attrs) {

                var renderTimeout;

                var dimensions = {
                    margins: { top: 20, right: 0, bottom: 10, left: 0 }
                };
                var svg = new Chart(ele[0], dimensions);
                var radius = Math.min(svg.width(), svg.height()) / 2;

                scope.$watch('pie', function (newPie) {
                    if (newPie != null) scope.render(newPie);
                }, true);

                scope.render = function (data) {
                    svg.selectAll('*').remove();

                    if (!data) return;
                    if (renderTimeout) $timeout.cancel(renderTimeout);


                    renderTimeout = $timeout(function () {
                        var color = d3.scale.category20();
                        var arc = d3.svg.arc().outerRadius(radius);
                        var pie = d3.layout.pie().value(function (d) {
                            return d.count
                        });
                        var total = d3.sum(data, function (d) {
                            return d.count;
                        });
                        var percentFormat = d3.format("0.2%");

                        svg.append("g")
                            .append("text")
                            .attr('dx', "8em")
                            .style({'font-size': '16pt'})
                            .text(scope.title);

                        var container = svg.append("g")
                            .attr("transform", "translate(" + svg.width() / 2 + "," + (svg.height() / 2 + 10) + ")");

                        var g = container.selectAll(".pieSlice")
                            .data(pie(data))
                            .enter().append("g")
                            .attr("class", "pieSlice");

                        g.append("path")
                            .attr("d", arc)
                            .style("fill", function (d) {
                                return color(d.value);
                            });

                        g.append("text")
                            .attr("transform", function (d) {
                                d.innerRadius = 0;
                                d.outerRadius = radius;
                                return "translate(" + arc.centroid(d) + ")";
                            })
                            .attr("dy", ".35em")
                            .style({"text-anchor": "middle", opacity: '0.0'})
                            .text(function (d) {
                                console.log(total);
                                var value = percentFormat(d.value / total);
                                return value;
                            });

                        g.on('mouseover', function (d) {
                            var nodeSelection = d3.select(this).style({opacity: '0.8'});
                            nodeSelection.select("text").style({opacity: '1.0'});
                        });

                        g.on('mouseout', function (d) {
                            var nodeSelection = d3.select(this).style({opacity: '1.0'});
                            nodeSelection.select("text").style({opacity: '0.0'});
                        });

                        var legendContainer = svg.append("g")
                            .attr("transform", "translate(0,30)");

                        var legend = legendContainer.selectAll(".legend")
                            .data(data)
                            .enter().append("g")
                            .attr('class', 'legend-label')
                            .attr("transform", function (d, i) {
                                return "translate(0," + i * 30 + ")";
                            });

                        legend.append("rect")
                            .attr("width", 18)
                            .attr("height", 18)
                            .style("fill", function (d, i) {
                                return color(d.count);
                            });
                        legend.append("text")
                            .attr("y", '13')
                            .attr("dx", "1.5em")
                            .text(function (d) {
                                console.log(d);
                                return d.bucket
                            })
                            .style({"text-anchor": "start"});


                        console.log(legend);
                    }, 200); // renderTimeout
                };
            }
        };
    }]
});
