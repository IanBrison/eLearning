'use strict';

var app = angular.module('eLearning', ['ngRoute', 'smoothScroll']);
var preTestResults = [];
var pre_test_all_question_numbers = 0;
var pre_test_all_correct_numbers = 0;
var finalTestResults = [];
var final_test_all_question_numbers = 0;
var final_test_all_correct_numbers = 0;

app.controller('preTestController', [function(){
  preTestResults = [];
  pre_test_all_question_numbers = 0;
  pre_test_all_correct_numbers = 0;
  finalTestResults = [];
  final_test_all_question_numbers = 0;
  final_test_all_correct_numbers = 0;
}]);

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
  }
  $scope.nextQuestion();
}]);

app.controller('preTestResultController', ['$scope', function($scope){
  $scope.result_title = "プレテスト結果";
  if(preTestResults.length == 0){
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
  pre_test_all_question_numbers = all_question_numbers;
  pre_test_all_correct_numbers = all_correct_numbers;
}]);

app.controller('topPageController', ['$scope', function($scope){
  $scope.content_type = 1;
  $scope.click = function(num){
    $scope.content_type = num;
  }
}]);

app.controller('finalTestController', ['$scope', '$http', '$anchorScroll', function($scope, $http, $anchorScroll){
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
      finalTestResults.push(result);
    }

    if($scope.questionNumber >= 5){
      location.href = "#/finalresult";
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
  }
  $scope.nextQuestion();
}]);

app.controller('finalTestResultController', ['$scope', function($scope){
  $scope.result_title = "最終テスト結果";
  if(finalTestResults.length == 0){
    var result = {
      "question_numbers": 3,
      "correct_numbers": 2
    }
    finalTestResults.push(result);
    finalTestResults.push(result);
    finalTestResults.push(result);
    finalTestResults.push(result);
    finalTestResults.push(result);
  }
  $scope.finalTestResults = finalTestResults;
  var all_question_numbers = 0;
  var all_correct_numbers = 0;
  for(var num = 0; num < finalTestResults.length; num++){
    all_question_numbers += finalTestResults[num].question_numbers;
    all_correct_numbers += finalTestResults[num].correct_numbers;
  }
  $scope.pre_all_question_numbers = pre_test_all_question_numbers;
  $scope.pre_all_correct_numbers = pre_test_all_correct_numbers;
  $scope.all_question_numbers = all_question_numbers;
  $scope.all_correct_numbers = all_correct_numbers;
  final_test_all_question_numbers = all_question_numbers;
  final_test_all_correct_numbers = all_correct_numbers;
}]);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/top', {
      templateUrl: 'partials/top-page.html',
      controller: 'topPageController'
    }).
    when('/pretest_before', {
      templateUrl: 'partials/pre-test-before.html',
      controller: 'preTestController'
    }).
    when('/pretest', {
      templateUrl: 'partials/pre-test-content.html',
      controller: 'preTestContentController'
    }).
    when('/preresult', {
      templateUrl: 'partials/pre-test-result.html',
      controller: 'preTestResultController'
    }).
    when('/finaltest', {
      templateUrl: 'partials/pre-test-content.html',
      controller: 'finalTestController'
    }).
    when('/finalresult', {
      templateUrl: 'partials/final-test-result.html',
      controller: 'finalTestResultController'
    }).
    otherwise({
      redirectTo: '/pretest_before'
    });
}]);
