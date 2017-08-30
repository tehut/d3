var  d3 = require('d3')
var $ = require('jquery')

console.log("in this")
var m = [20, 120, 20, 120],
    w = 1280, //- m[1] - m[3],,
    h = 800 ,//- m[0] - m[2],
    i = 0,
    root;

var tree = d3.layout.tree()
    .size([h, w]);

var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x]; });

var vis = d3.select("body").append("svg")
    .attr("width", w)
    .attr('height', h)
    // .attr("width", w + m[1] + m[3])
    // .attr("height", h + m[0] + m[2])
    .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

d3.json("newjson.json", function (json) {
    root = json;
    console.log(json)
    console.log(h)
    console.log(root)
    root.x0 = h / 2;
    root.y0 = 0;

    function toggleAll(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    }

    // Initialize the display to show a few nodes.
    // root.children.forEach(toggleAll);
    toggle(root.children[1]);
    toggle(root.children[2]);
    toggle(root.children[3]);


    // toggle(root.children[1]);
    // toggle(root.children[9]);
    // toggle(root.children[9].children[0]);

    update(root);
});

function update(source) {
    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", function (d) { toggle(d); update(d); });

    nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("svg:text")
        .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function (d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
            var o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
        })
        .transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children.
function toggle(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
}









// collapsed tree visualization

// var margin = { top: 30, right: 20, bottom: 30, left: 20 },
//     width = 960 - margin.left - margin.right,
//     barHeight = 20,
//     barWidth = width * .8;

// var i = 0,
//     duration = 400,
//     root;

// var tree = d3.layout.tree()
//     .nodeSize([0, 20]);

// var diagonal = d3.svg.diagonal()
//     .projection(function (d) { return [d.y, d.x]; });

// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// //found a snippet to start visualizaiton closed
//     // Toggle children.
// function toggle(d) {
//     if (d.children) {
//         d._children = d.children;
//         d.children = null;
//     } else {
//         d.children = d._children;
//         d._children = null;
//     }
// }
// // moveChildren("./flare.json");
// d3.json("./flare.json", function (error, flare) {
//     root = flare
//     function toggleAll(d) {
//         if (d.children) {
//             d.children.forEach(toggleAll);
//             toggle(d);
//         }
//     }

//     // Initialize the display to show a few nodes.
//     root.children.forEach(toggleAll);
//     toggle(root.children[1]);
//     toggle(root.children[1].children[2]);
//     toggle(root.children[9]);
//     toggle(root.children[9].children[0]);

//     update(root);
//     if (error) throw error;

//     flare.x0 = 0;
//     flare.y0 = 0;
//     update(root = flare);
// });

// function update(source) {

//     // Compute the flattened node list. TODO use d3.layout.hierarchy.
//     var nodes = tree.nodes(root);

//     var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

//     d3.select("svg").transition()
//         .duration(duration)
//         .attr("height", height);

//     d3.select(self.frameElement).transition()
//         .duration(duration)
//         .style("height", height + "px");

//     // Compute the "layout".
//     nodes.forEach(function (n, i) {
//         n.x = i * barHeight;
//     });

//     // Update the nodes…
//     var node = svg.selectAll("g.node")
//         .data(nodes, function (d) { return d.id || (d.id = ++i); });

//     var nodeEnter = node.enter().append("g")
//         .attr("class", "node")
//         .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
//         .style("opacity", 1e-6);

//     // Enter any new nodes at the parent's previous position.
//     nodeEnter.append("rect")
//         .attr("y", -barHeight / 2)
//         .attr("height", barHeight)
//         .attr("width", barWidth)
//         .style("fill", color)
//         .on("click", click);

//     nodeEnter.append("text")
//         .attr("dy", 3.5)
//         .attr("dx", 5.5)
//         .text(function (d) { return d.name; });

//     // Transition nodes to their new position.
//     nodeEnter.transition()
//         .duration(duration)
//         .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
//         .style("opacity", 1);

//     node.transition()
//         .duration(duration)
//         .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
//         .style("opacity", 1)
//         .select("rect")
//         .style("fill", color);

//     // Transition exiting nodes to the parent's new position.
//     node.exit().transition()
//         .duration(duration)
//         .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
//         .style("opacity", 1e-6)
//         .remove();

//     // Update the links…
//     var link = svg.selectAll("path.link")
//         .data(tree.links(nodes), function (d) { return d.target.id; });

//     // Enter any new links at the parent's previous position.
//     link.enter().insert("path", "g")
//         .attr("class", "link")
//         .attr("d", function (d) {
//             var o = { x: source.x0, y: source.y0 };
//             return diagonal({ source: o, target: o });
//         })
//         .transition()
//         .duration(duration)
//         .attr("d", diagonal);

//     // Transition links to their new position.
//     link.transition()
//         .duration(duration)
//         .attr("d", diagonal);

//     // Transition exiting nodes to the parent's new position.
//     link.exit().transition()
//         .duration(duration)
//         .attr("d", function (d) {
//             var o = { x: source.x, y: source.y };
//             return diagonal({ source: o, target: o });
//         })
//         .remove();

//     // Stash the old positions for transition.
//     nodes.forEach(function (d) {
//         d.x0 = d.x;
//         d.y0 = d.y;
//     });
// }

// // Toggle children on click.
// function click(d) {
//     if (d.children) {
//         d._children = d.children;
//         d.children = null;
//     } else {
//         d.children = d._children;
//         d._children = null;
//     }
//     update(d);
// }

// function color(d) {
//     return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
// }
