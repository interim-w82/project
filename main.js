//// OSM Example
// var mapOptions = {
//   center: [37.8, -96.9],
//   zoom: 4,
//   zoomControl: false,
//   attributionControl: false,
// };

// var mymap = L.map('mapid', mapOptions);
// var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
// mymap.addLayer(layer );

//// D3 Map
// const width = 960;
// const height = 500;


// let margin = {top: 10, left: 10, bottom: 10, right: 10};

let width = parseInt (
  d3.selectAll('#mapsvg').style('width')
);

// width = width - margin.left - margin.right;

let mapRatio = .5;

let height = width * mapRatio;

// let width = map.node().getBoundingClientRect().width;
// let height = 500;

// D3 Projection
let projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);
    // .translate([width/2, height/2])    // translate to center of screen
    // .scale([1000]);          // scale things down so see entire US

// Define path generator
let path = d3.geoPath(projection);               // path generator that will convert GeoJSON to SVG paths
    // .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
let color = d3.scaleLinear()
    .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

let legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
// const svg = d3.selectAll("#mapid")
//       .append("svg")
//       .attr("id", "mapsvg")
//     // .attr("width", width)
//     //   .attr("height", height)
// ;

const svg = d3.selectAll("#mapsvg");

// Set initial height
svg.style("height", height + "px");
// console.log(height);

// Append Div for tooltip to SVG
// const div = d3.selectAll("#mapid")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

// d3.csv('yourcsv.csv')
//   .then( function(data) {
//       // data is now whole data set
//       // draw chart in here!
//   })
//   .catch(function(error){
//      // handle error if something goes wrong with loading the data
//   })

// Load in my states data!
d3.csv("stateslived.csv")
  .then( function(data) {

    color.domain([0,1,2,3]); // setting the range of the input data

    // Load GeoJSON data and merge with states data
    d3.json("us-states.json")
      .then( function(json) {

	// Loop through each state data value in the .csv file
	for (let i = 0; i < data.length; i++) {

	  // Grab State Name
	  const dataState = data[i].state;

	  // Grab data value
	  const dataValue = data[i].visited;

	  // Find the corresponding state inside the GeoJSON
	  for (let j = 0; j < json.features.length; j++)  {
	    const jsonState = json.features[j].properties.name;

	    if (dataState == jsonState) {

	      // Copy the data value into the JSON
	      json.features[j].properties.visited = dataValue;

	      // Stop looking through the JSON
	      break;
	    }
	  }
	}

	// Bind the data to the SVG and create one path per GeoJSON feature
	svg.selectAll("path")
	  .data(json.features)
	  .enter()
	  .append("path")
	  .attr("d", path)
	  .attr("class", "state")
	  .style("stroke", "#fff")
	  .style("stroke-width", "1")
	  .style("fill", function(d) {

	    // Get data value
	    const value = d.properties.visited;

	    if (value) {
	      //If value exists…
	      return color(value);
	    } else {
	      //If value is undefined…
	      return "rgb(213,222,217)";
	    }
	  });

	// Map the cities I have lived in!
	// d3.csv("cities-lived.csv")
	//   .then( function(data) {

	//     svg.selectAll("circle")
	//       .data(data)
	//       .enter()
	//       .append("circle")
	//       .attr("cx", function(d) {
	//	return projection([d.lon, d.lat])[0];
	//       })
	//       .attr("cy", function(d) {
	//	return projection([d.lon, d.lat])[1];
	//       })
	//       .attr("r", function(d) {
	//	return Math.sqrt(d.years) * 4;
	//       })
	//       .style("fill", "rgb(217,91,67)")
	//       .style("opacity", 0.85)

	//     // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
	//     // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
	//       .on("mouseover", function(d) {
	//	div.transition()
	//	  .duration(200)
	//	  .style("opacity", .9);
	//	div.text(d.place)
	//	  .style("left", (d3.event.pageX) + "px")
	//	  .style("top", (d3.event.pageY - 28) + "px");
	//       })

	//     // fade out tooltip on mouse out
	//       .on("mouseout", function(d) {
	//	div.transition()
	//	  .duration(500)
	//	  .style("opacity", 0);
	//       });
	//   });

	// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
      //	var legend = d3.selectAll("#mapid")
      //	    .append("svg")
      //	    .attr("class", "legend")
      //	    .attr("width", 140)
      //	    .attr("height", 200)
      //	    .selectAll("g")
      //	    .data(color.domain().slice().reverse())
      //	    .enter()
      //	    .append("g")
      //	    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      //	legend.append("rect")
      //	  .attr("width", 18)
      //	  .attr("height", 18)
      //	  .style("fill", color);

      //	legend.append("text")
      //	  .data(legendText)
      //	  .attr("x", 24)
      //	  .attr("y", 9)
      //	  .attr("dy", ".35em")
      //	  .text(function(d) { return d; });
      });

  });


function resize() {
    // adjust things when the window size changes
    width = parseInt(d3.select('#mapid').style('width'));
  console.log(width);
  // width = width
    // - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection
	.translate([width / 2, height / 2])
	.scale(width);


  path = d3.geoPath(projection);               // path generator that will convert GeoJSON to SVG paths
    // resize the map container
    svg
	.style('width', width + 'px')
	.style('height', height + 'px');

    // resize the map
    // map.selectAll('.land').attr('d', path);
    // map.selectAll('.state').attr('d', path);

  svg.selectAll("path").attr('d', path);
  // svg.selectAll("circle").attr('d', path);
}

d3.select(window).on('resize', resize);


/////////// Barc Graph

// create 2 data_set
var data1 = [
   {group: "A", value: 4},
   {group: "B", value: 16},
   {group: "C", value: 8}
];

var data2 = [
   {group: "A", value: 7},
   {group: "B", value: 1},
   {group: "C", value: 20},
   {group: "D", value: 10}
];

// set the dimensions and margins of the graph
// var margin = {top: 30, right: 30, bottom: 70, left: 60},
    // chartwidth = 460 - margin.left - margin.right,
    // chartheight = 400 - margin.top - margin.bottom;

let chartwidth = parseInt (
  d3.selectAll('#chartsvg').style('width')
);

let chartheight = parseInt (
  d3.selectAll('#chartsvg').style('height')
);


// append the svg object to the body of the page
var chart = d3.select("#chartsvg")
    .attr("width", chartwidth)
    .attr("height", chartheight)
    .append("g");
    // .attr("transform",
    //	  "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, chartwidth ])
  .padding(0.2);

var xAxis = chart.append("g")
    .attr("transform", "translate(0," + chartheight + ")");

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ chartheight, 0]);
var yAxis = chart.append("g")
    .attr("class", "myYaxis");


// A function that create / update the plot for a given variable:
function update(data) {

  // Activate
  // for (let i in )

  // Update the X axis
  x.domain(data.map(function(d) { return d.group; }));
  xAxis.call(d3.axisBottom(x));

  // Update the Y axis
  y.domain([0, d3.max(data, function(d) { return d.value }) ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  // Create the u variable
  var u = chart.selectAll("rect")
      .data(data);

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return x(d.group); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return chartheight - y(d.value); })
    .attr("fill", "#69b3a2");

  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove();
}

// Initialize the plot with the first dataset
update(data1);
