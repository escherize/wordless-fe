var myApp = angular.module('myApp', []);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    delete $httpProvider.defaults.headers.common['Content-Type'];
}]);

var w = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
x = w.innerWidth || e.clientWidth || g.clientWidth,
y = w.innerHeight|| e.clientHeight|| g.clientHeight;

min = function(a, b){ if (a < b) return a; else return b;}
current_charge = function(height, width){ return -2000;}


function ThesaurusCtrl($scope, $http){
    $scope.myWord = "";
    $scope.myResponse = "{}";
    $scope.node = "";
    // d3 init stuff:


    $scope.sendD3Request = function (){
        // post? http://stackoverflow.com/questions/14970578/how-do-i-post-parameter-on-d3-json
        var local_url = "http://localhost:3000/graph/?word=" + $scope.myWord;
        var aws_url = "http://ec2-54-187-218-134.us-west-2.compute.amazonaws.com:3000/graph/?word=" + $scope.myWord;
        // todo: put url back.  the local_url is for localhost.
        //console.log ("sending reqest to: " + local_url);
        d3.json(aws_url, $scope.showGraph);
    };

    $scope.showGraph = function(graph){

        // make sure data's correct
        console.log(graph.nodes);
        console.log(graph.links);


        // get conditions for when we were called
        $scope.height = y;
        $scope.width  = x;



        d3.select("svg").remove();
        $scope.graphContainer = d3.select("#graph-container").append("svg").attr("width", $scope.width).attr("height", $scope.height);
        $scope.force = d3.layout.force().charge(current_charge($scope.height, $scope.width))
            .linkDistance( min(x, y) * .1).size([$scope.width, $scope.height - 300]);

        // setup link and node
        $scope.node = $scope.graphContainer.selectAll(".node").data(graph.nodes);
        $scope.link = $scope.graphContainer.selectAll(".link").data(graph.links);

        // remove all link and nodes and text and circles.
        $scope.graphContainer.selectAll(".node").data(graph.nodes).exit().remove();
        $scope.graphContainer.selectAll(".link").data(graph.links).exit().remove();

        $scope.graphContainer.selectAll("text").remove();
        $scope.graphContainer.selectAll("circle").remove();

        // add new link and node
        $scope.node.enter().append("g").attr("class", "node")
            .on("click", function(d){
                $scope.myWord = d.label;
                $scope.sendD3Request();
            })
            .call($scope.force.drag);

        $scope.node.append("circle");

        $scope.node.append("text").attr("text-anchor", "middle").attr("fill", "black").text(function(d) { return d.label });
        $scope.link.enter().append("line").attr("class", "link");


        // start graph pysics
        $scope.force.nodes(graph.nodes).links(graph.links).start();

        $scope.force.on("tick", function(){
            $scope.link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            $scope.node.attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"});
        });

        //console.log(graph.nodes);
        //console.log(graph.links);

    };

    function updateWindow(){
        x = w.innerWidth || e.clientWidth || g.clientWidth;
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        $scope.graphContainer.attr("width", x);
        $scope.graphContainer.attr("height", y - 350);
        $scope.force.charge(current_charge(x, y));
    }
    window.onresize = updateWindow;

}
