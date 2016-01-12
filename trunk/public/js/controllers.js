'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('ScheduleCtrl', function ($scope) {
    // write Ctrl here
    // possibly change and add people names as a set of each task
    $scope.tasks = [];

    $scope.editedTask = {};
    $scope.edit = -1;
    $scope.idcount = 0;

  

    $scope.addTask = function() {
      $scope.tasks.push({
        id: $scope.idcount++,
        name: $scope.name,
        sunday: $scope.sunday,
        monday: $scope.monday,
        tuesday: $scope.tuesday,
        wednesday: $scope.wednesday,
        thursday: $scope.thursday,
        friday: $scope.friday,
        saturday: $scope.saturday,
        editing: false
      });
    };

    $scope.editTask = function (task) {
        $scope.edit= $scope.tasks.indexOf(task);
        $scope.editedTask = angular.copy(task);
        console.log(task);
        console.log($scope.editedTask);

       // $scope.editedTask = task;
    }

    $scope.doneEditing = function (task) {
        $scope.tasks[$scope.edit] = $scope.editedTask;
        $scope.edit = false;

       // $scope.editedTask = null;
    };

    $scope.removeTask = function(index) {
      $scope.tasks.splice(index, 1);
    };


      $scope.editCell = function($event) {
            //  making the double click dialogue for editing cells 
        $('.redips-drag').on("dblclick", function() {
          var $dialog = $("<div>", {class:"dialog-container"});
          var $input = $("<input>", {class:"dialog-input"});
          var $button = $("<button>", {class:"dialog-button"}).text("Save");
          $("#schedule-container").append($dialog);
          $(".dialog-container")[0].style.opacity = "0";
          $(".dialog-container")[0].style.width = "0rem";
          $($dialog).css('top', $(this).offset().top);
          $($dialog).css('left', $(this).offset().left);
          $(".dialog-container")[0].style.opacity = "1";
          $(".dialog-container")[0].style.width = "10rem";
          $($dialog).text("Who should be here?").append($input).append($button);
          //  delete element if clicked outside
          $(document).mouseup(function (e) {
            var container = $(".dialog-container");
            if (!container.is(e.target) //  if the target of the click isn't the container
                && container.has(e.target).length === 0) // nor a descendant of the container
            {
                container.hide();
                container.remove();
            }
          });
        });
      }
  });