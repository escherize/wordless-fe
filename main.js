var myApp = angular.module('myApp', []);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    delete $httpProvider.defaults.headers.common['Content-Type']}
]);

function ThesaurusCtrl($scope, $http){
    $scope.myWord = "lemon";
    //$scope.myResponse = "{\"links\":[{\"value\":1,\"target\":\"stinker\",\"source\":\"lemon\"},{\"value\":1,\"target\":\"gamboge\",\"source\":\"lemon\"},{\"value\":1,\"target\":\"lemon yellow\",\"source\":\"lemon\"},{\"value\":1,\"target\":\"maize\",\"source\":\"lemon\"},{\"value\":1,\"target\":\"citrus limon\",\"source\":\"lemon\"},{\"value\":1,\"target\":\"lemon tree\",\"source\":\"lemon\"}],\"nodes\":[{\"name\":\"lemon\"},{\"name\":\"stinker\"},{\"name\":\"gamboge\"},{\"name\":\"lemon yellow\"},{\"name\":\"maize\"},{\"name\":\"citrus limon\"},{\"name\":\"lemon tree\"}]}";
    $scope.myResponse = "{}"



    $scope.sendRequest = function(){

        //$http.post("http://127.0.0.1:3000/graph/?", {word: $scope.myWord})
        $http({
            method:'POST',
            url:"http://localhost:3000/graph/",
            headers: {withCredentials: false},
            data: {word: $scope.myWord}
        })
        .success(function(response){
            $scope.myResponse = response;
        })
        .error(function(response, status, headers, config){
            console.log("not works :(");
            console.log('response:');
            console.log(response);
            console.log('headers:');
            console.log(headers);
            console.log('status:');
            console.log(status);
            console.log('config:');
            console.log(config);
        });
    }
}



// tried:
//var xmlhttp = new XMLHttpRequest();
//xmlhttp.onreadystatechange = function(){
//    $scope.myResponse = xmlhttp.responseText;
//}
//
//xmlhttp.open("get", "localhost:3000/graph/?word=word", true);
//xmlhttp.send();