/**********************************************************************************
* # D3 Homework - Data Journalism and D3                                          *
***********************************************************************************
1. Include more demographics and more risk factors. 
   - Place additional labels in your scatter plot and give them click events so that 
     your users can decide which data to display. 
   - Animate the transitions for your circles' locations as well as the range of
     your axes. 
   - Do this for two risk factors for each axis. 
   - Or, for an extreme challenge, create three for each axis.
* Hint: Try binding all of the CSV data to your circles. This will let you easily 
determine their x or y values when you click the labels.

2. Incorporate d3-tip
While the ticks on the axes allow us to infer approximate values for each circle, 
it's impossible to determine the true value without adding another layer of data. 
Enter tooltips: developers can implement these in their D3 graphics to reveal a 
specific element's data when the user hovers their cursor over the element. 
Add tooltips to your circles and display each tooltip with the data that the user 
has selected. Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged)
—we've already included this plugin in your assignment directory.

* Check out [David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) to see how you should implement tooltips with d3-tip.
.                    *
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

// // establish the connection to the html
// d3.select("#Scatter").append("div").attr("class", "tooltip").style("opacity",0);



  /************************************************************************
  * CREATE FUNCTIONS TO SCALE, UPDATE AXIS, UPDATE CIRCLES, TOOLTIP
  ************************************************************************/
  // Initial Parameters
  var chosenXAxis = "poverty";
  
  // Create a function to update x-scale var upon click on axis label
  function xScale(metadata, chosenXAxis) {
     
    // create x scale function
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(metadata, d => d.chosenXAxis) * 0.8,
        d3.max(metadata, d => d.chosenXAxis) * 1.2
      ])
      .range([0, width]);

    return xLinearScale;  
  }
  
  // Create a function to update x-Axis var upon click on axis label
  function renderAxes(newScale, xAxis) {

    // create the x-axis function
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // Create a function to update circles group with a transition to new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    label = "Poverty (%):";
  }
  else if (chosenXAxis === "age") {
    label = "Age (Median):";
  }
  else {
    label = "Income:"

  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.poverty}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


/************************************************************************
 * BRING THE DATA 
 ***********************************************************************/

// establish conection to the data
d3.csv("/assets/data/data.csv").then(function(metadata, err) {
  if(err) throw err;
  //Parse data to Integer values
  metadata.forEach(function(metadata) {
    metadata.poverty = +metadata.poverty;
    metadata.age = +metadata.age;
    metadata.income = +metadata.income;
    metadata.healthcare = +metadata.healthcare;
    metadata.obesity = +metadata.obesity;
    metadata.smokes = +metadata.smokes;
  })  

  // xLinearScale function above csv import
  var xLinearScale = xScale(metadata, chosenXAxis);  


  // create y scale function
  var yLinearScale = d3.scaleLinear()
   .domain([d3.min(metadata, d => d.healthcare) * 0.8,
     d3.max(metadata, d => d.healthcare) * 1.2
   ])
   .range([height, 0]);
  
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

 // append y axis  
 chartGroup.append("g")
    .call(leftAxis);
  
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(metadata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))  
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");
  
  /************************************************************************
 * CREATE GROUP 2 -X-AXIS
 ***********************************************************************/
// Grup 2 of Metadata
  
// Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
  
  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (median)");
  
  /************************************************************************
 * APPEND GROUP 2 -Y-AXIS
 ***********************************************************************/    
    
  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Healthcare Rate (%)");
  
  
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smoke (%)");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obese (%)");
  
  /************************************************************************
 * TOOLTIP UPDATE
 ***********************************************************************/    
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup); 

  /************************************************************************
 * WRITE EVENT LISTENER
 ***********************************************************************/  
  
  // x axis labels event listener
  labelsGroup.selectAll("text")
  .on("click", function() {

    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
    
      // replaces chosenXaxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // updates x scale for new data
      xLinearScale = xScale(metadata, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values 
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (choseXAxis === "healthcare") { 
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else { 
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });



}).catch(function(error) {
console.log(error);  


}) 











  
