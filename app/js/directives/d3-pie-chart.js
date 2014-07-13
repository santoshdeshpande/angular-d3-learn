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
                var arc = d3.svg.arc().outerRadius(radius-10);
                var arcOver = d3.svg.arc().outerRadius(radius);

                scope.$watch('pie', function (newPie) {
                    if (newPie != null) scope.render(newPie);
                }, true);

                scope.render = function (data) {
                    svg.selectAll('*').remove();

                    if (!data) return;
                    if (renderTimeout) $timeout.cancel(renderTimeout);


                    function showText(i) {
                        var nodeSelection = d3.select("#slice-" + i).transition().duration(100).style({opacity: '0.8'});
                        nodeSelection.attr('class', 'selected-slice pieSlice');
                        nodeSelection.select("path").transition().duration(50).attr('d', arcOver);
                        nodeSelection.select("text").transition().duration(100).style({opacity: '1.0'});

                    }

                    function hideText(i) {
                        var nodeSelection = d3.select("#slice-" + i).transition().duration(100).style({opacity: '1.0'});
                        nodeSelection.attr('class', 'pieSlice');
                        nodeSelection.select("path").transition().duration(200).attr('d', arc);
                        nodeSelection.select("text").transition().duration(100).style({opacity: '0.0'});
                    }

                    renderTimeout = $timeout(function () {
                        var color = d3.scale.category20();

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
                            .attr("class", "pieSlice")
                            .attr('id', function (d, i) {
                                return "slice-" + i
                            });

                        g.append("path")
                            .attr("d", arc)
                            .style('cursor', 'pointer')
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

                        g.on('mouseover', function (d, i) { showText(i);});

                        g.on('mouseout', function (d, i) { hideText(i);});

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
                            .style('cursor', 'pointer')
                            .style("fill", function (d, i) {
                                return color(d.count);
                            });

                        legend.append("text")
                            .attr("y", '13')
                            .attr("dx", "1.5em")
                            .style('cursor', 'pointer')
                            .text(function (d) {
                                console.log(d);
                                return d.bucket
                            })
                            .style({"text-anchor": "start"});

                        legend.on('mouseover', function (d, i) {showText(i);})
                            .on('mouseout', function (d, i) { hideText(i);})

                        console.log(legend);
                    }, 200); // renderTimeout
                };
            }
        };
    }]
});
