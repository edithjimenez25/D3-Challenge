/**********************************************************************************
* # D3 Homework - Data Journalism and D3                                          *
***********************************************************************************
* # Core Assignment: D3 Dabbler (Required Assignment) 
  1. You need to create a scatter plot between two of the data variables such
    as `Healthcare vs. Poverty` or `Smokers vs. Age`.
  2. Using the D3 techniques we taught you in class, create a scatter plot 
     that represents each state with circle elements. You'll code this graphic
     in the `app.js` file of your homework directory—make sure you pull in the
     data from `data.csv` by using the `d3.csv` function. Your scatter plot 
     should ultimately appear like the image at the top of this section.
     - Include state abbreviations in the circles.
     - Create and situate your axes and labels to the left and bottom of the chart.                    *
***********************************************************************************/

// basic settings for svg container
var svgWidth = 800;
var svgHeight = 500;

// define the margin
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// chart area minus margin
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, 
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
 

// Append an SVG group that hold the chart and shift the chart to the left and top margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// establish conection to the data
d3.csv("/assets/data/data.csv").then(function(metadata) {
  
  //change data to numeric values
  metadata.forEach(function(metadata) {
    metadata.poverty = +metadata.poverty;
    metadata.age = +metadata.age;
    metadata.income = +metadata.income;
    metadata.healthcare = +metadata.healthcare;
    metadata.obesity = +metadata.obesity;
    metadata.smokes = +metadata.smokes;
  })  
/************************************************************************
 * CREATE SCALE FUNCTIONS
 ************************************************************************/
  // create x scale function
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(metadata, d => d.poverty) * 0.8,
      d3.max(metadata, d => d.poverty) * 1.2
    ])
    .range([0, width]);

    
  // create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(metadata, d => d.healthcare) * 0.8,
      d3.max(metadata, d => d.healthcare) * 1.2
    ])
    .range([height, 0]);

  
/************************************************************************
 * DEFINE VAR AXIS AND APPEND EACH AXIS AND APPLY SOME STYLE 
 ************************************************************************/
  
  // Define var axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .style("font-size", "18px")
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .style("font-size", "18px")
    .call(leftAxis);

  
/************************************************************************
 * CREATE CIRCLES
 ************************************************************************/
  var circlesGroup = chartGroup.selectAll("circle")
      .data(metadata)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 20)
      .attr("fill", "#FDA7DF")
      .attr("opacity", ".3");

/************************************************************************
* WRITE THE TEXT IN THE CIRCLES
************************************************************************/
  chartGroup.selectAll("text.text-circles")
      .data(metadata)
      .enter()
      .append("text")
      .classed("text-circles",true)
      .text(d => d.abbr) // abreviation for state
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("dy",5) //  The dy attribute indicates a shift along the y-axis on the position of an element or its content
      .attr("text-anchor","middle")
      .attr("font-size","12px");

/* The text-anchor attribute is used to align (start-, middle- or end-alignment) 
a string of pre-formatted text or auto-wrapped text where the wrapping area is 
determined from the inline-size property relative to a given point*/

/************************************************************************
* APPEND THE AXIS
************************************************************************/

// append y axis
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height/1.5))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Lacks of Healthcare (%)");  

// append x axis
  chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText" )
      .attr("dy", "1em")
      .text("In Poverty (%)");  




})



  
