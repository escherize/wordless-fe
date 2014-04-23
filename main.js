var myApp = angular.module('myApp', []);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    delete $httpProvider.defaults.headers.common['Content-Type']}

]);

function ThesaurusCtrl($scope, $http){
    $scope.myWord = "";

    $scope.myResponse = "{}";

    // d3 init stuff:
    $scope.height = 400;
    $scope.width  = parseFloat(d3.select("#graph-container").style('width'));
    console.log($scope.width);
    console.log($scope.height);
    $scope.graphContainer = d3.select("#graph-container")
                                .append("svg")
                                .attr("width", $scope.width)
                                .attr("height", $scope.height);


    $scope.force = d3.layout.force()
        .charge(-400)
        .linkDistance(120)
        .size([$scope.width, $scope.height]);

    // sendRequest uses the angular $http module to send a POST for
    // the data located at the following url
    $scope.sendNgRequest = function(){
        $http({
            method:'POST',
            url:"http://localhost:3000/graph/",
            data: {word: $scope.myWord},
            withCredentials: true
        })
        .success(function(response){
                $scope.showGraph(response);
        })
        .error(function(response, status, headers, config){
            console.log("not works T___T!");
        });
    }

    $scope.sendD3Request = function (){
// post? http://stackoverflow.com/questions/14970578/how-do-i-post-parameter-on-d3-json
    var url = "http://localhost:3000/graph/?word=" + $scope.myWord;
        // todo: put url back.  the string below is for localhost.
        // to run locally: cd to the wordless-fe directory and run:
        // python mock_server
    d3.json("http://localhost:3333/stuff.json", $scope.showGraph)

    };

    $scope.showGraph = function(graph){

        console.log(graph.nodes);
        console.log(graph.links);

        //consume
        $scope.force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        $scope.link = $scope.graphContainer.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link");

        $scope.node = $scope.graphContainer.selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call($scope.force.drag);

        $scope.node.append("circle")
            .attr("r", 45)
            .attr("fill-opacity", .1)
            .style("fill", "#777");

        $scope.node.append("text")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text(function(d) { return d.name });

        $scope.force.on("tick", function(){
            $scope.link.attr("x1", function(d) { return d.source.x; })
                       .attr("y1", function(d) { return d.source.y; })
                       .attr("x2", function(d) { return d.target.x; })
                       .attr("y2", function(d) { return d.target.y; });

            $scope.node.attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"});
        });

        console.log(graph.nodes);
        console.log(graph.links);

    };
}
