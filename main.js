// const major = [""
let globalD;
let dataCiti;
let currentCategory;
let states = [
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

// ];
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
    .range(["#BDBDBD","#999999","#7F7F7F","#666666"]);

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
const div = d3.selectAll("#mapid")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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
	      return "#c9c9c9";
	    }
	  });

	// Map the cities I have lived in!
	d3.csv("cities-lived.csv")
	  .then( function(data) {
	    dataCiti = data;

	    // console.log(projection(["-74.007124", "40.71455"]));

	    svg.selectAll("circle")
	      .data(dataCiti)
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

d3.csv('user.csv').then((d) => {
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

  let schoolArr = d.map(s => s.school_name);

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  var unique = schoolArr.filter( onlyUnique ); // returns ['a', 1, 2, '1']

  let schoolingArr = unique.map((i => i.replace(" ", "+")));


  console.log(schoolingArr);

  let latArr = [];
  let lonArr = [];
  let stateArr = [];


    // var matrix = [
    //  {name: "Lee Gai Fun", age: 42, sex: "M"},
    //  {name: "Laia Hamidullah", age: 27, sex: "F" },
    //  {name: "Abraham Mdulla", age: 33, sex: "M" }
    // ];

    var tr = d3.select(".objecttable tbody")
	.selectAll("tr")
	.data(d)
	.enter().append("tr")
	.attr("class", "row");

    var td = tr.selectAll("td")
     .data(function(d, i) { return Object.values(d); })
	.enter().append("td")
	.attr("class", "cell")
	.text(function(d) { return d; });

  // for (i in schoolingArr) {
  //   console.log(i);
  //   fetch("https://nominatim.openstreetmap.org/search.php?q=" + i + "&format=json")
  //     .then(function(response) {
  //	return response.json();
  //     })
  //     .then(function(myJson) {
  //	// console.log(JSON.stringify(myJson));
  //	latArr.push(myJson[0].lat);
  //	lonArr.push(myJson[0].lon);
  //	stateArr.push(myJson[0].display_name.split(", ")[4]);
  //     });
  // }

  // fetch("https://nominatim.openstreetmap.org/search.php?q=calvin+university&format=json")
  //   .then(function(response) {
  //     return response.json();
  //   })
  //   .then(function(myJson) {
  //     console.log(JSON.stringify(myJson));
  //     console.log(myJson[0].lat);
  //   });

  // d3.selectAll('#user-count').text("Total Registrants: " + d.length);
  // d3.selectAll('#shirt-count').text("Shirts" );
  // d3.selectAll('#shirt-info').text(`XS (${shirtLen[0]}) S (${shirtLen[1]}) M (${shirtLen[2]}) L (${shirtLen[3]}) XL (${shirtLen[4]}) XXL (${shirtLen[5]})`);

  // d3.selectAll('#diet-count').text("Dietary Restrictions: " + (d => d.dietary_restrictions).length);
  update(d, "Race", undefined);

}).catch(error => {
  console.error(error);
});

// set the dimensions and margins of the graph
let margin = {top: 20, right: 20, bottom: 30, left: 20};

let chartwidth = parseInt (
  d3.selectAll('#chartsvg').style('width')
) - margin.left - margin.right;

let chartheight = 250 - margin.top - margin.bottom;
    // parseInt (
//   d3.selectAll('#chartsvg').style('height')
// );

// let defaultRatio = chartwidth / chartheight;


// append the svg object to the body of the page
var chart = d3.select("#chartsvg")
    .attr("width", chartwidth)
    .attr("height", chartheight)
    .append("g")
    .attr("transform",
	  "translate(" + margin.left + "," + margin.top + ")");

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


function dataFilter(data, category, trueData) {
  currentCategory = category;
  switch (category) {
  case "Race":
    const raceArr = ["ASIAN",
		     "WHITE",
		     "BLACK",
		     "HISPANIC",
		     "OTHER"];

    const raceLen = raceArr.map(raceVal =>
      data.map(d => d.race)
	.filter(r => r.includes(raceVal))
	.length);

    for (let i = 0; i < raceArr.length; ++i) {
      trueData.push({"group": raceArr[i], "value": raceLen[i]});
    }
    break;

  case "Gender":
    const genArr = ["Male",
		    "Female",
		    "I prefer not to say"];

    const genLen = genArr.map(genVal =>
      data.map(d => d.gender)
	.filter(g => g.includes(genVal))
	.length);

    for (let i = 0; i < genArr.length; ++i) {
      trueData.push({"group": genArr[i], "value": genLen[i]});
    }
    break;

  case "Skill":
    const skillArr = ["0", "1", "2", "3", "4"];
    const skillLen = skillArr.map(skillVal =>
      data.map(d => d.skill_level)
	.filter(s => s.includes(skillVal))
	.length);

    for (let i = 0; i < skillArr.length; ++i) {
      trueData.push({"group": skillArr[i], "value": skillLen[i]});
    }
    break;

  case "Major":
    const majorArr = ["Computer", "Engineering", "Physics", "Other"];
    const majorLen = majorArr.map(majorVal =>
      data.map(d => d.major)
	.filter(s => s.includes(majorVal))
	.length);

    for (let i = 0; i < majorArr.length; ++i) {
      trueData.push({"group": majorArr[i], "value": majorLen[i]});
    }
    break;
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
  // chartheight = parseInt(d3.selectAll('#my_dataviz').style('height'));
  // let chartratio = chartwidth / chartheight;

  // if (chartratio > defaultRatio) {
  //   chartwidth = chartheight * defaultRatio;
  // } else {
  //   chartheight = chartwidth / defaultRatio;
  // }

  // console.log(width);
  // width = width
  // - margin.left - margin.right;

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

  // circles

  var yo = svg.selectAll(".my-circles")
      .data(dataCiti);

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

// function tabulate(data, columns) {
  // let table = d3.select(".wrap-table100").append("div")
  //     .attr("class", "table");

  // let thead = table.append("div").attr("class", "row header");

  // // append the header row
  // thead.selectAll(".cell")
  //   .data(columns)
  //   .enter()
  //   .append("div")
  //   .attr("class", "cell")
  //   .text(d => d.column);

  // // create a row for each object in the data
  // let rows = table.selectAll(".row")
  //     .data(data)
  //     .enter()
  //     .append("div")
  //     .attr("class", "row");

  // // create a cell in each row for each column
  // let cells = rows.selectAll(".cell")
  //     .data(// row =>
  //	// columns.map(
  //	  // column =>
  //	  // {column: column, "value": row[column]}))
  //     function(row) {
  //	return columns.map(function(column) {
  //	  return {column: column, value: row[column]};
  //	});
  //     })
  //     .enter()
  //     .append("div")
  //     .attr("class", "cell")
  //     .html(d => d.value);

  // return table;
// }

// render the table
// var peopleTable = tabulate(data, ["Full Name", "Graduation Date", "School", "Major"]);
    // var matrix = [
    //  {name: "Lee Gai Fun", age: 42, sex: "M"},
    //  {name: "Laia Hamidullah", age: 27, sex: "F" },
    //  {name: "Abraham Mdulla", age: 33, sex: "M" }
    // ];

    // var tr = d3.select(".objecttable tbody")
    //	.selectAll("tr")
    //	.data(matrix)
    //	.enter().append("tr")
    //	.attr("class", "row");

    // var td = tr.selectAll("td")
    //  .data(function(d, i) { return Object.values(d); })
    //	.enter().append("td")
    //	.attr("class", "cell")
    //	.text(function(d) { return d; });
