'use strict';

var app = angular.module('eLearning', ['ngRoute']);
var preTestResults = [];

app.controller('preTestContentController', ['$scope', '$http', '$anchorScroll', function($scope, $http, $anchorScroll){
  $scope.questionNumber = 0;
  $scope.button_value = "next";
  $scope.nextQuestion = function(){
    if($scope.questions != null){
      var correct_numbers = 0;
      for(var num = 0; num < $scope.questions.length; num++){
        if($scope.questions[num].your_answer != null && $scope.questions[num].your_answer == $scope.questions[num].real_answer){
          correct_numbers++;
        }
      }
      var result = {
        "question_numbers": $scope.questions.length,
        "correct_numbers": correct_numbers
      }
      preTestResults.push(result);
    }

    if($scope.questionNumber >= 5){
      location.href = "#/preresult";
      return;
    }else if($scope.questionNumber == 4){
      $scope.button_value = "finish";
    }

    $scope.questionNumber++;

    $http.get('stores/talk' + $scope.questionNumber + '.json').success(function(data) {
      $scope.talks = data;
    }).error(function(){
      $scope.talks = null;
    });
    $http.get('stores/question' + $scope.questionNumber + '.json').success(function(data) {
      $scope.questions = data;
    }).error(function(){
      $scope.questions = null;
    });;
    $anchorScroll();
  }
  $scope.nextQuestion();
}]);

app.controller('preTestResultController', ['$scope', function($scope){
  if(preTestResults == null){
    var result = {
      "question_numbers": 3,
      "correct_numbers": 2
    }
    preTestResults.push(result);
    preTestResults.push(result);
    preTestResults.push(result);
    preTestResults.push(result);
    preTestResults.push(result);
  }
  $scope.preTestResults = preTestResults;
  var all_question_numbers = 0;
  var all_correct_numbers = 0;
  for(var num = 0; num < preTestResults.length; num++){
    all_question_numbers += preTestResults[num].question_numbers;
    all_correct_numbers += preTestResults[num].correct_numbers;
  }
  $scope.all_question_numbers = all_question_numbers;
  $scope.all_correct_numbers = all_correct_numbers;
}]);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/top', {
      templateUrl: 'partials/top-page.html'
    }).
    when('/pretest', {
      templateUrl: 'partials/pre-test-before.html',
    }).
    when('/question', {
      templateUrl: 'partials/pre-test-content.html',
      controller: 'preTestContentController'
    }).
    when('/preresult', {
      templateUrl: 'partials/pre-test-result.html',
      controller: 'preTestResultController'
    }).
    otherwise({
      redirectTo: '/pretest'
    });
}]);
