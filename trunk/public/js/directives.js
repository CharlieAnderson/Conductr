'use strict';

/* Directives */

var myApp = angular.module('myApp.directives', []);

  myApp.directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });

//Credit for ngBlur and ngFocus to https://github.com/addyosmani/todomvc/blob/master/architecture-examples/angularjs/js/directives/
myApp.directive('ngBlur', function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.ngBlur);
    });
  };
});

myApp.directive('ngFocus', function( $timeout ) {
  return function( scope, elem, attrs ) {
    scope.$watch(attrs.ngFocus, function( newval ) {
      if ( newval ) {
        $timeout(function() {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
});

myApp.directive('redipsRepeat', function() {
	return function(scope, elem, attrs) {
		console.log("directive called");
		if(scope.$last) {
			console.log("last");
			angular.element(elem).addClass("redips-drag");
			REDIPS.drag.init();
		}
	};
});