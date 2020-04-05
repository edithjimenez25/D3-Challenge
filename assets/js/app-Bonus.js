/**********************************************************************************
* # D3 Homework - Data Journalism and D3                                          *
***********************************************************************************
1. Include more demographics and more risk factors. 
   - Place additional labels in your scatter plot and give them click events so that 
     your users can decide which data to display. 
   - Animate the transitions for your circles' locations as well as the range of
     your axes. 
   - Do this for two risk factors for each axis or create three for each axis.

2. Incorporate d3-tip
   - While the ticks on the axes allow us to infer approximate values for each circle, 
     it's impossible to determine the true value without adding another layer of data. 
   - Enter tooltips: developers can implement these in their D3 graphics to reveal a 
     specific element's data when the user hovers their cursor over the element. 
   - Add tooltips to your circles and display each tooltip with the data that the user 
     has selected.
***********************************************************************************/

// basic settings for svg container
var svgWidth = 800;
var svgHeight = 500;

// define the margin
var margin = {
  top: 30,
  right: 40,
  bottom: 80,
  left: 100
};

// chart area minus margin
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

// Create an SVG wrapper, 
var svg = chart.append('svg') 
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group that hold the chart and shift the chart to the left and top margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
/************************************************************************
* CREATE PARAMETERS FOR BOTH AXIS , BOTH AXIS SHOULD BE RESPONSIVE
************************************************************************/
// Initial Parameters
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';


/************************************************************************
* CREATE FUNCTIONS TO SCALE, UPDATE AXIS, UPDATE CIRCLES, TOOLTIP
************************************************************************/  
// Create a function to update x-scale var upon click on axis label
function xScale(metadata, chosenXAxis) {
    
  // create x scale function
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(metadata, d => d[chosenXAxis]) * 0.8,
      d3.max(metadata, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
  
// Create a function to update y-scale var upon click on axis label
function yScale(metadata, chosenYAxis) {
    
  // create x scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(metadata, d => d[chosenYAxis]) * 0.8,
      d3.max(metadata, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;  
}


/************************************************************************
* CREATE FUNCTIONS TO UPDATE AXIS
************************************************************************/ 

// Create a function to update x-Axis var upon click on axis label
function renderXAxis(newXScale, xAxis) {

  // create the x-axis function
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// Create a function to update y-Axis var upon click on axis label
function renderYAxis(newYScale, yAxis) {

  // create the x-axis function
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


/************************************************************************
* CREATE FUNCTIONS TO UPDATE CIRCLES
************************************************************************/ 

// Create a function to update circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(2000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


/************************************************************************
* CREATE FUNCTIONS TO UPDATE STATE LABELS
************************************************************************/ 
  
// Create a function to update circles text labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(2000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

//function style for x values on tooltips

function styleX(value, chosenXAxis) {

  if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
  else if (chosenXAxis === 'age') {
      return `${value}`;
  }
  else {
    return `${value}`;
  }
}

/************************************************************************
* CREATE FUNCTIONS TO UPDATE THE CIRCLES GROUP WITH THE NEW TOOLTIP 
************************************************************************/ 

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // Define X labels
  if (chosenXAxis === "poverty") {
    var xLabel = "Poverty (%):";
  }
  else if (chosenXAxis === "age") {
    var xLabel = "Age (Median):";
  }
  else {
    var xLabel = "Income (Median):";

  }

  // Define Y labels
  if (chosenYAxis === "healthcare") {
    var yLabel = "Healthcare Rate (%):";
  }
  else if (chosenYAxis === "smokes") {
    var yLabel = "Smokes (%):";
  }
  else {
    var yLabel = "Obesity (%):";

  }
  
  // Set up tool tip (using reference) 
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);
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

      /************************************************************************
       * CREATE LINEAR SCALE
      *************************************************************************/
      
      // xLinearScale function above csv import
      var xLinearScale = xScale(metadata, chosenXAxis);  
      var yLinearScale = yScale(metadata, chosenYAxis);

      // Create initial axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // append x axis
      var xAxis = chartGroup.append("g")
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

      // append y axis
      var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);


      // append initial circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(metadata)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))  
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("opacity", ".5");


      // Append initial text - define on d3Style
      var textGroup = chartGroup.selectAll('.stateText') 
        .data(metadata)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis]))
        .attr('dy', 3)
        .attr('font-size', '11px')
        .text(function(d){return d.abbr});

      /************************************************************************
     * CREATE GROUP 3 -X-AXIS
     ***********************************************************************/
      
      // Create group for  3 x- axis labels
      var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

      // First x - Axis
      var povertyLabel = xLabelsGroup.append("text")
        .classed("active", true)
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("Poverty (%)");
      
      // Second x - Axis
      var ageLabel = xLabelsGroup.append("text")
        .classed("inactive", true)
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") 
        .text("Age (Median)");
      
      // Third x - Axis  
      var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") 
        .classed("inactive", true)
        .classed("aText", true)
        .text("Income (median)");
      
    /************************************************************************
     * APPEND GROUP 3 -Y-AXIS
     ***********************************************************************/    
    
      // Create group for  3 y- axis labels
      var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/5}, ${height/4})`); 
    
      // First y - axis
      var healthcareLabel= yLabelsGroup.append("text")
        .classed("aText", true)
        .classed('active', true) 
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left/1.5)
        .attr("x", 0 - (height/3.5))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .text("Healthcare Rate (%)");
      
      // Second y - axis
      var smokesLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed('inactive', true)
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left/1.5)
        .attr("x", 0 - (height /3.5))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .text("Smoke Rate (%)");

      // Third y - axis  
      var obesityLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed('inactive', true)
        .attr("transform", "rotate(-90)")
        .attr("y", 1 - margin.left/1.5)
        .attr("x", 0 - (height / 3.5))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .text("Obese Rate (%)");
      
      /************************************************************************
      * TOOLTIP UPDATE
      ***********************************************************************/    
      // updateToolTip function above csv import
      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup); 

      /**********************************************************************
      * WRITE EVENT LISTENER X AXIS
      ***********************************************************************/  
      
      // x axis labels event listener
      xLabelsGroup.selectAll("text")
      .on("click", function() {

        // get value of selection
        var value = d3.select(this).attr("value");

        if (value !== chosenXAxis) {
        
          // replaces chosenXaxis with value
          chosenXAxis = value;

          // updates x scale for new data
          xLinearScale = xScale(metadata, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);

          // updates circles with new x values 
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYaxis);

          // update text in the circles with new x values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          /**********************************************************************
          * CHANGING CLASSES IN THE X - AXIS TO CHANGE THE TEXT BOLD
          ***********************************************************************/   

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);  
          }
          else if (choseXAxis === "age") { 
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else { 
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

    /**********************************************************************
    * WRITE EVENT LISTENER Y AXIS
    ***********************************************************************/  
      // y axis labels event listener
      yLabelsGroup.selectAll("text")
      .on("click", function() {

        // get value of selection
        var value = d3.select(this).attr("value");

        if (value !== chosenYAxis) {
        
          // replaces chosenXaxis with value
          chosenYAxis = value;

          // updates x scale for new data
          yLinearScale = yScale(metadata, chosenYAxis);

          // updates x axis with transition
          yAxis = renderYAxis(yLinearScale, yAxis);

          // updates circles with new x values 
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYaxis);

          // update text in the circles with new x values
          TextGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYaxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          /**********************************************************************
          * CHANGING CLASSES IN THE Y - AXIS TO CHANGE THE TEXT BOLD
          ***********************************************************************/        

          // changes classes to change bold text
          if (chosenYAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);  
          }
          else if (choseYAxis === "smokes") { 
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);  
          }
          else { 
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);  
          }
        }
      });

  /**********************************************************************
  * CATCHING ERRORS
  ***********************************************************************/        

}).catch(function(error) {
  console.log(error);  
})   
