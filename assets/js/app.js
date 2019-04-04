// Set up the chart viewport
var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, 
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//----------------------------------------------------------------------------------------------------
// // Initial Params
// var chosenXaxis = "poverty"
// var chosenYaxis = "healthcare"  

// // function used for udating x-scale var upon click on axis label
// function xScale(healthData, chosenXaxis) {
//   // create scales
//   var xlinearScale = d3.scaleLinear()
//     .domain([d3.min(healthData, d => d[chosenXaxis]),
//     d3.max(healthData, d => d[chosenXaxis])
//     ])
//     .range([0, width])
//   return xLinearScale
// }
// // function used for udating y-scale var upon click on axis label
// function yScale(healthData, chosenYaxis) {
//   // create scales
//   var ylinearScale = d3.scaleLinear()
//     .domain([d3.min(healthData, d => d[chosenYaxis]),
//     d3.max(healthData, d => d[chosenYaxis])
//     ])
//     .range([height, 0])
//   return yLinearScale
// }

// // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating circles group with a transition to new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis) {
//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));
//   return circlesGroup;
// }

//----------------------------------------------------------------------------------------------------
// Load data from csv file (starting from the index.html file path)
d3.csv("assets/data/data.csv").then(function(healthData) {
  console.log(healthData);

  // Parse the data. Format the data and convert to numerical values
  healthData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // Create the scales for the chart
  var xScale = d3.scaleLinear()
    .domain([8, d3.max(healthData, d => d.poverty)])
    .range([0, width]);
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

   // Create the axes
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // Append the axes to the chartGroup
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // Add y-axis
  chartGroup.append("g").call(leftAxis);

  // Append circles to data points
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "13")
    .classed("stateCircle", true);

  // Append state text labels
  var statesLabel = chartGroup.selectAll("texts")
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", data => xScale(data.poverty))
    .attr("y", data => yScale(data.healthcare)+5)
    .classed("stateText", true)
    .text(d => d.abbr);

  // Append x-axis label
  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + 40})`)
    .classed("aText", true)
    .text("In Poverty (%)");

  // Appen y-axis label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .classed("aText", true)
    .text("Lacks Healthcare (%)");

});


