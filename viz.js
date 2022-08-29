


//Width and height
var w = 500;
var h = 100;
var barPadding = 1;
console.log("Running");
var dataset = [
    {month:"Yearly", data:4.71}, 
    {month:"January", data:4.24},
    {month:"February", data:4.67},
    {month:"March", data:5.12},
    {month:"April", data:5.17},
    {month:"May", data:5.03},
    {month:"June", data:4.69},
    {month:"July", data:4.25}, 
    {month:"August", data:4.48}, 
    {month:"September", data:5.01}, 
    {month:"October", data:5.08}, 
    {month:"November", data:4.51},
    {month:"December", data:4.31}, 
    ];

//Create SVG element
/*
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return i * (w / dataset.length);
    })
    .attr("y", function(d) {
        return h - (d.data * 4);
    })
    .attr("width", w / dataset.length - barPadding)
    .attr("height", function(d) {
        return d.data * 4;
    });

*/

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/sortable-bar-chart
function BarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width = 640, // the outer width of the chart, in pixels
    height = 400, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor", // bar fill color
    duration: initialDuration = 250, // transition duration, in milliseconds
    delay: initialDelay = (_, i) => i * 20 // per-element transition delay, in milliseconds
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    
    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);
  
    // Omit any data not present in the x-domain.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]));
  
    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
    const format = yScale.tickFormat(100, yFormat);
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    const yGroup = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").call(grid))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    let rect = svg.append("g")
        .attr("fill", color)
      .selectAll("rect")
      .data(I)
      .join("rect")
        .property("key", i => X[i]) // for future transitions
        .call(position, i => xScale(X[i]), i => yScale(Y[i]))
        .style("mix-blend-mode", "multiply")
        .call(rect => rect.append("title")
            .text(i => [X[i], format(Y[i])].join("\n")));
    console.log(rect)
    const xGroup = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
  
    // A helper method for updating the position of bars.
    function position(rect, x, y) {
      return rect
          .attr("x", x)
          .attr("y", y)
          .attr("height", typeof y === "function" ? i => yScale(0) - y(i) : i => yScale(0) - y)
          .attr("width", xScale.bandwidth());
    }
  
    // A helper method for generating grid lines on the y-axis.
    function grid(tick) {
      return tick.append("line")
          .attr("class", "grid")
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke", "currentColor")
          .attr("stroke-opacity", 0.1);
    }
  
    // Call chart.update(data, options) to transition to new data.
    return Object.assign(svg.node(), {
      update(data, {
        xDomain, // an array of (ordinal) x-values
        yDomain, // [ymin, ymax]
        duration = initialDuration, // transition duration, in milliseconds
        delay = initialDelay // per-element transition delay, in milliseconds
      } = {}) {
        // Compute values.
        const X = d3.map(data, x);
        const Y = d3.map(data, y);
        console.log("Updating");
        // Compute default domains, and unique the x-domain.
        if (xDomain === undefined) xDomain = X;
        if (yDomain === undefined) yDomain = [0, d3.max(Y)];
        xDomain = new d3.InternSet(xDomain);
  
        // Omit any data not present in the x-domain.
        const I = d3.range(X.length).filter(i => xDomain.has(X[i]));
        console.log(xDomain);
        console.log(yDomain);
        console.log(X);
        console.log(Y);
        // Update scale domains.
        xScale.domain(xDomain);
        yScale.domain(yDomain);
  
        // Start a transition.
        const t = svg.transition().duration(duration);
  
        // Join the data, applying enter and exit.
        rect = rect
            .data(I, function(i) { return this.tagName === "rect" ? this.key : X[i]; })
            .join(
              enter => enter.append("rect")
                  .property("key", i => X[i]) // for future transitions
                  .call(position, i => xScale(X[i]), yScale(0))
                  .style("mix-blend-mode", "multiply")
                  .call(enter => enter.append("title")),
              update => update,
              exit => exit.transition(t)
                  .delay(delay)
                  .attr("y", yScale(0))
                  .attr("height", 0)
                  .remove()
            );
  
        // Update the title text on all entering and updating bars.
        rect.select("title")
            .text(i => [X[i], format(Y[i])].join("\n"));
  
        // Transition entering and updating bars to their new position. Note
        // that this assumes that the input data and the x-domain are in the
        // same order, or else the ticks and bars may have different delays.
        rect.transition(t)
            .delay(delay)
            .call(position, i => xScale(X[i]), i => yScale(Y[i]));
  
        // Transition the x-axis (using a possibly staggered delay per tick).
        xGroup.transition(t)
            .call(xAxis)
            .call(g => g.selectAll(".tick").delay(delay));
  
        // Transition the y-axis, then post process for grid lines etc.
        yGroup.transition(t)
            .call(yAxis)
          .selection()
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick").selectAll(".grid").data([,]).join(grid));
      }
    });
  }

  chart = BarChart(dataset, {
    x: d => d.month,
    y: d => d.data,
    yFormat: ".2f",
    yLabel: "Avg Practical Potential",
    width: 640,
    height: 500,
    color: "steelblue",
    duration: 750 // slow transition for demonstration
  });
  console.log(chart);
  //d3.select("body").append(chart);
  document.body.appendChild(chart);
  blank = {};
  update = undefined;
  //update = chart.update(d3.sort(dataset, blank))
  //update = chart.update(dataset, blank);