// Set up chart`
var svgWidth = 1000;
var svgHeight = 700;
var margin = {top: 10, right: 40, bottom: 60, left: 50};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Import Data
d3.csv("data.csv", function(err, data) {
    if (err) throw err;
  
    // Step 1: Parse Data/Cast as numbers
     // ==============================
    data.forEach(function(data) {
      data.obesity = +data.obesity;
      data.smokesHigh = +data.smokesHigh;
    });
  
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(data, d => d.obesity)])
      .range([0, width]);
  
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.smokesHigh)])
      .range([height, 0]);
  
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    chartGroup.append("g")
      .call(leftAxis);

    var theCircles = svg.selectAll("g theCircles")
    .data(data)
    .enter();
     // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.smokesHigh))
    .attr("r", "10")
//    .attr("r",function(d){return d.abbr})
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
  
//  Create State Labels
//.attr("r", circRadius)
//.attr("class", function(d) {
//  return "stateCircle " + d.abbr;
//})  
                
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Obesity%: ${d.obesity}<br>Smoker%: ${d.smokesHigh}`);
      });
  
    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smoker");
  
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Obesity");
  });
  