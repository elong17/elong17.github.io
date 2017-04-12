
var width = 960,
    height = 500;

// var projection = d3.geoAlbersUsa()
//     .scale(1000)
//     .translate([width / 2, height / 2]);

// d3 geopath for projection
var path = d3.geo.path();

// create SVG elements in map HTML element
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// set color
var color = d3.scale.threshold()
    .domain([-0.90, -0.50, -0.25, -0.10, 0.00, 0.10, 0.25, 0.50, 0.93])
    .range(["#2166ac", "#4393c3", "#92c5de","#d1e5f0", "#f7f7f7", "#fddbc7", "#f4a582","#d6604d", "#b2182b"]);

// queue up the datasets, run 'ready' when loaded
queue()
    .defer(d3.json, "us.json")
    .defer(d3.tsv, "election_2016.tsv")
    .await(ready);

// create the graphic with this function
function ready(error, us, margin) {
  if (error) throw error;

  var marginById = {}; // Create empty object for holding dataset
  margin.forEach(function(d) {
    marginById[d.id] = +d.margin; // Create property for each ID, give it value from margin
    // important: cast margin to numeric value (+)
  });
  console.log(marginById);
  
  // create and style counties
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(marginById[d.id]); });

  // create state outlines
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
      .attr("class", "states")
      .attr("d", path);
}