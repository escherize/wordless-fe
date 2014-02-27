/**
 * Created by bcm on 2/13/14.
 */

(function (){
    console.log("initializing...");

    // initialize the svg.
    d3.select("#graph-container")
        .append("svg")
        .attr("id", "graph-svg")
        .attr("width", "500")
        .attr("height", "500");
})();