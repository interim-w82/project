// TODO: Ugly Hacks
let globalD;
let cityData;
let currentCategory;

const states = [
  "Alabama",
  "Alaska",
  "Arkansas",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Iowa",
  "Idaho",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Mississippi",
  "Montana",
  "North Carolina",
  "North Dakota",
  "Nebraska",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "Nevada",
  "New York",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Virginia",
  "Vermont",
  "Washington",
  "Wisconsin",
  "West Virginia",
  "Wyoming"];
var raceArray = ["ASIAN",
		 "WHITE",
		 "BLACK",
		 "HISPANIC",
		 "OTHER"];
var genderArray = ["Male",
		   "Female",
		   "I prefer not to say"];
var majorArray = ["Computer", "Engineering", "Physics", "Other"];
var skill_levelArray = ["4", "3", "2", "1", "0"];


let width = parseInt (
  d3.selectAll('#mapsvg').style('width')
);

let mapRatio = .5;

let height = width * mapRatio;

// D3 Projection
let projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

// Define path generator
let path = d3.geoPath(projection);

// Define linear scale for output
let color = d3.scaleLinear()
    .range(["#BDBDBD","#999999","#7F7F7F","#666666"]);

let legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

const svg = d3.selectAll("#mapsvg");

// Set initial height
svg.style("height", height + "px");

// Append Div for tooltip to SVG
const div = d3.selectAll("#mapid")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


/////////// Barc Graph
d3.csv('data/user.csv').then((d) => {
  const shirtArr = ["XS",
		    "S",
		    "M",
		    "L",
		    "XL",
		    "XXL"];

  const shirtLen = shirtArr.map(shirtVal =>
    d.map(b => b.shirt_size)
      .filter(g => g.includes(shirtVal))
      .length);

  globalD = d;

  let tableObjArr = [];
  let tableObj = d.forEach((number) => {
    tableObjArr.push({ "Class Standing": number.class_standing, "Major": number.major, "Shirt Size": number.shirt_size, "School": number.school_name });
  });


  let tr = d3.select("table")
      .selectAll("tr")
      .data(tableObjArr)
      .enter().append("tr")
      .attr("class", "row");

  let td = tr.selectAll("td")
      .data(function(d, i) { return Object.values(d); })
      .enter().append("td")
      .attr("class", "cell")
      .text(function(d) { return d; });

  d3.selectAll('#user-count').text("Total Registrants: " + d.length);
  d3.selectAll('#shirt-count').text("Shirts" );
  d3.selectAll('#shirt-info').text(`XS (${shirtLen[0]}) S (${shirtLen[1]}) M (${shirtLen[2]}) L (${shirtLen[3]}) XL (${shirtLen[4]}) XXL (${shirtLen[5]})`);
  d3.selectAll('#diet-count').text("Dietary Restrictions: " + (d => d.dietary_restrictions).length);

  update(d, "race", undefined);

  d3.csv("data/states.csv")
    .then( function(data) {

      color.domain([0,1,2,3]); // setting the range of the input data

      // Load GeoJSON data and merge with states data
      d3.json("data/us-states.json")
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
		return "#c9c9c9";
	      }
	    });

	  // Map the cities I have lived in!
	  d3.csv("data/cities.csv")
	    .then( function(data) {
	      cityData = data;

	      svg.selectAll("circle")
		.data(cityData)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
		  return projection([d.lon, d.lat])[0];
		})
		.attr("cy", function(d) {
		  return projection([d.lon, d.lat])[1];
		})
		.attr("r", function(d) {
		  return Math.sqrt(d.years) * 4;
		})
		.attr('class', 'my-circles')
		.style("fill", "#891A2F")
		.style("opacity", 0.65)

		.on("mouseover", function(d) {
		  div.transition()
		    .duration(200)
		    .style("opacity", .9);
		  div.text(d.place)
		    .style("left", (d3.event.pageX - width / 5) + "px")
		    .style("top", (d3.event.pageY - 28) + "px");
		})

		.on("mouseout", function(d) {
		  div.transition()
		    .duration(500)
		    .style("opacity", 0);
		});
	    });

	});

    });

}).catch(error => {
  console.error(error);
});

let margin = {top: 20, right: 10, bottom: 0, left: 10};

let chartwidth = parseInt (
  d3.selectAll('#chartsvg').style('width')
) - margin.left - margin.right;

let chartheight = 300; //- margin.top - margin.bottom;

// append the svg object to the body of the page
let chart = d3.select("#chartsvg")
    .attr("width", chartwidth)
    .attr("height", chartheight)
    .append("g")
    .attr("transform",
	  "translate(" + margin.left + "," + -20 + ")");

// Initialize the X axis
let x = d3.scaleBand()
    .range([ 0, chartwidth ])
    .padding(0.2);

let xAxis = chart.append("g")
    .attr("transform", "translate(0," + chartheight + ")");

// Initialize the Y axis
let y = d3.scaleLinear()
    .range([ chartheight, 0]);
let yAxis = chart.append("g")
    .attr("class", "myYaxis");


function dataFilter(data, category, trueData) {
  currentCategory = category;

  const lengthArr = window[category + "Array"].map(val =>
    data.map(d => d[category])
      .filter(s => s.includes(val))
      .length);

  for (let i = 0; i < window[category + "Array"].length; ++i) {
    trueData.push({"group": window[category + "Array"][i], "value": lengthArr[i]});
  }
}

// A function that create / update the plot for a given variable:
function update(data, category, evt) {
  if (evt) {
    let tablinks = document.getElementsByClassName("data-button");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active-button", "");
    }

    evt.currentTarget.className += " active-button";
  }

  let trueData = [];

  dataFilter(data, category, trueData);

  // Update the X axis
  x.domain(trueData.map(d => d.group));
  xAxis.call(d3.axisBottom(x));

  // Update the Y axis
  y.domain([0, d3.max(trueData, d => d.value)]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  // Create the u variable
  var u = chart.selectAll("rect")
      .data(trueData);

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
    .attr("x", d => x(d.group))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => chartheight - y(d.value))
    .attr("fill", "#999999");

  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove();
}

function resize() {
  // adjust things when the window size changes
  width = parseInt(d3.select('#mapid').style('width'));
  height = width * mapRatio;

  chartwidth = parseInt(d3.selectAll('#my_dataviz').style('width'));

  // update projection
  projection
    .translate([width / 2, height / 2])
    .scale(width);


  path = d3.geoPath(projection);               // path generator that will convert GeoJSON to SVG paths
  // resize the map container
  svg
    .style('width', width + 'px')
    .style('height', height + 'px');

  svg.selectAll("path").attr('d', path);

  // circles

  var yo = svg.selectAll(".my-circles")
      .data(cityData);

  yo
    .enter()
    .append("circle")
    .merge(yo) // get the already existing elements as well
    .attr("cx", function(d) {
      return projection([d.lon, d.lat])[0];
    })
    .attr("cy", function(d) {
      return projection([d.lon, d.lat])[1];
    })
    .attr("r", function(d) {
      return Math.sqrt(d.years) * 4;
    })
    .style("fill", "#891A2F")
    .style("opacity", 0.65)
    .on("mouseover", function(d) {
      div.transition()
	.duration(200)
	.style("opacity", .9);
      div.text(d.place)
	.style("left", (d3.event.pageX - width / 5) + "px")
	.style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      div.transition()
	.duration(500)
	.style("opacity", 0);
    });

  ichart = d3.select("#chartsvg")
    .attr("width", chartwidth)
    .attr("height", chartheight)
    .append("g");

  // Initialize the X axis
  x = d3.scaleBand()
    .range([ 0, chartwidth ])
    .padding(0.2);

  ixAxis = chart.append("g")
    .attr("transform", "translate(0," + chartheight + ")");

  y = d3.scaleLinear()
    .range([ chartheight, 0]);
  yAxis = chart.append("g")
    .attr("class", "myYaxis");


  update(globalD, currentCategory, undefined);
}

d3.select(window).on('resize', resize);

function search() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementsByClassName("table");
  tr = document.querySelectorAll('.row:not(.header)');
  for (i = 0; i < tr.length; i++) {
    txtValue = tr[i].textContent || tr[i].innerText;

    // console.log(txtValue);
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

function hey() {
  alert("Not Logged In!");
}


 /* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
  var x = document.getElementById("mob-links");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
    x.style.width = "100vw";
  }
}
