/* global
 define: false,
 console: false
 */
define([
], function ( ) {
    'use strict';

    return ['$timeout','$compile', function($timeout, $compile){
        return {
            restrict: 'E',
            scope: {
                min: '=',
                max: '=',
                callback: '&',
                currentValue: '='
            },
            replace: true,
            template: '<div class="row">\n    <div class="small-10 medium-11 columns">\n        <div class="range-slider" data-slider data-options="start:0; end:10;display_selector: #sliderOutput3;">\n            <span class="range-slider-handle"></span>\n            <span class="range-slider-active-segment"></span>\n            <input type="hidden">\n        </div>\n    </div>\n    <div class="small-2 medium-1 columns">\n        <span id="sliderOutput3" style="display: block;margin-top: 30px;"></span>\n    </div>    \n</div>\n',
            link: function(scope, element, attrs) {
                $compile(element.contents())(scope);
                $(document).foundation();
                scope.$watch('currentValue', function(){
                    element.foundation('slider', 'set_value', scope.currentValue);
                });

                element.bind('change.fndtn.slider', function(data){
                    var target = data.target;
                    scope.currentValue = $(target).attr('data-slider');
                    scope.$apply();
                    scope.callback();
                });

            }
        }
    }];
});