var  d3 = require('d3')
var $ = require('jquery')
const square = d3.selectAll("rect");
square.style("fill", "orange"); 

console.log("roger 1-2")

var margin = { top: 30, right: 20, bottom: 30, left: 20 },
    width = 960 - margin.left - margin.right,
    barHeight = 20,
    barWidth = width * .8;

var i = 0,
    duration = 400,
    root;

var tree = d3.layout.tree()
    .nodeSize([0, 20]);

var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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
// moveChildren("./flare.json");
d3.json("./flare.json", function (error, flare) {
    root = flare
    function toggleAll(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    }

    // Initialize the display to show a few nodes.
    root.children.forEach(toggleAll);
    toggle(root.children[1]);
    toggle(root.children[1].children[2]);
    toggle(root.children[9]);
    toggle(root.children[9].children[0]);

    update(root);
    if (error) throw error;

    flare.x0 = 0;
    flare.y0 = 0;
    update(root = flare);
});

function update(source) {

    // Compute the flattened node list. TODO use d3.layout.hierarchy.
    var nodes = tree.nodes(root);

    var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

    d3.select("svg").transition()
        .duration(duration)
        .attr("height", height);

    d3.select(self.frameElement).transition()
        .duration(duration)
        .style("height", height + "px");

    // Compute the "layout".
    nodes.forEach(function (n, i) {
        n.x = i * barHeight;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .style("opacity", 1e-6);

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
        .attr("y", -barHeight / 2)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .style("fill", color)
        .on("click", click);

    nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", 5.5)
        .text(function (d) { return d.name; });

    // Transition nodes to their new position.
    nodeEnter.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1);

    node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1)
        .select("rect")
        .style("fill", color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
        .style("opacity", 1e-6)
        .remove();

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(tree.links(nodes), function (d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
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

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

function color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

//     var treeData = [
//     {
//         "name": "",
//         "parent": "null",
//         "icon":"https://github.com/tehut/d3/blob/master/src/plane.png?raw=true",
//         "children": [
//             {
//                 "name": "Level 2: A",
//                 "parent": "Top Level",
//                 "children": [
//                     {
//                         "name": "Son of A",
//                         "parent": "Level 2: A"
//                     },
//                     {
//                         "name": "Daughter of A",
//                         "parent": "Level 2: A"
//                     }
//                 ]
//             },
//             {
//                 "name": "Level 2: B",
//                 "parent": "Top Level"
//             }
//         ]
//     }
// ]; var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height"),
//     g = svg.append("g").attr("transform", "translate(" + (width / 2 - 15) + "," + (height / 2 + 25) + ")");

// var stratify = d3.stratify()
//     .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

// var tree = d3.cluster()
//     .size([360, 390])
//     .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

// d3.json("trial.json", function (error, data) {
//     if (error) throw error;

//     var root = tree(stratify(data)
//         .sort(function (a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); }));

//     var link = g.selectAll(".link")
//         .data(root.descendants().slice(1))
//         .enter().append("path")
//         .attr("class", "link")
//         .attr("d", function (d) {
//             return "M" + project(d.x, d.y)
//                 + "C" + project(d.x, (d.y + d.parent.y) / 2)
//                 + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
//                 + " " + project(d.parent.x, d.parent.y);
//         });

//     var node = g.selectAll(".node")
//         .data(root.descendants())
//         .enter().append("g")
//         .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
//         .attr("transform", function (d) { return "translate(" + project(d.x, d.y) + ")"; });

//     node.append("circle")
//         .attr("r", 2.5);

//     node.append("text")
//         .attr("dy", ".31em")
//         .attr("x", function (d) { return d.x < 180 === !d.children ? 6 : -6; })
//         .style("text-anchor", function (d) { return d.x < 180 === !d.children ? "start" : "end"; })
//         .attr("transform", function (d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
//         .text(function (d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
// });

// function project(x, y) {
//     var angle = (x - 90) / 180 * Math.PI, radius = y;
//     return [radius * Math.cos(angle), radius * Math.sin(angle)];
// }