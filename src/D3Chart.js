import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// import * as d3 from "d3";
//
const MARGIN = {
  TOP: 10,
  BOTTOM: 50,
  LEFT: 70,
  RIGHT: 10
};
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
  constructor(element) {
    const vis = this;

    vis.svg = d3
      .select(element)
      .append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append("g") // append group
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    // const dragHandler = d3.drag().on("drag", function() {
    //   d3.select(this)
    //     .attr("m", d3.event.m)
    //     .attr("n", d3.event.n);
    // });
    //
    // dragHandler(vis.svg);
    // console.log(vis.svg);

    // x axios label
    vis.xLabel = vis.svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 50)
      .attr("text-anchor", "middle")
      .text("The world's tallest men");

    // y axios label
    vis.svg
      .append("text")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("Height in cm")
      .attr("transform", "rotate(-90)");

    // add X and Y axises group once
    vis.xAxisGroup = vis.svg
      .append("g")
      .attr("transform", `translate(0, ${HEIGHT})`); // move x axis to the bottom

    vis.yAxisGroup = vis.svg.append("g");

    // fetch sets of data for switching
    Promise.all([
      d3.json("https://udemy-react-d3.firebaseio.com/tallest_men.json"),
      d3.json("https://udemy-react-d3.firebaseio.com/tallest_women.json")
    ]).then(datasets => {
      vis.menData = datasets[0];
      vis.womenData = datasets[1];
      // to display first set of data
      vis.update("men");
    });
  }

  // update method
  update(gender) {
    const vis = this;

    vis.data = gender === "men" ? vis.menData : vis.womenData;
    vis.xLabel.text(`The world's tallest ${gender}`);

    // implementing scaling bars by axios y
    const y = d3
      .scaleLinear()
      .domain([
        d3.min(vis.data, d => d.height) * 0.95,
        d3.max(vis.data, d => d.height)
      ])
      .range([HEIGHT, 0]);
    // console.log(y(100)) // return aprox 183

    // implementing scaling bars by axios x
    const x = d3
      .scaleBand()
      .domain(vis.data.map(d => d.name))
      .range([0, WIDTH])
      .padding(0.4);

    // recalculate X and Y axises in order to update
    const xAxisCall = d3.axisBottom(x);
    vis.xAxisGroup
      .transition()
      .duration(500)
      .call(xAxisCall);

    const yAxisCall = d3.axisLeft(y);
    vis.yAxisGroup
      .transition()
      .duration(500)
      .call(yAxisCall);

    // DATA JOIN tells d3 which array of data we want to associate with our data
    const rects = vis.svg.selectAll("rect").data(vis.data);

    // EXIT remove elements that display on the screen but not exist in the new array of data
    rects
      .exit()
      .transition()
      .duration(500)
      .attr("height", "0")
      .attr("y", HEIGHT)
      .remove();

    // UPDATE data that exist in the new array and display on the screen
    rects
      .transition()
      .duration(500)
      .attr("x", d => x(d.name)) // using scaling function x
      .attr("y", d => y(d.height)) // start bars from bottom
      .attr("width", x.bandwidth)
      .attr("height", d => HEIGHT - y(d.height)); // using scaling function y

    // ENTER append attributes that does not exist in our data and on the screen
    rects
      .enter()
      .append("rect")
      .attr("x", d => x(d.name)) // using scaling function x
      .attr("width", x.bandwidth)
      .attr("fill", "grey")
      .attr("y", HEIGHT) // bars raise from bottom to top
      .transition()
      .duration(500)
      .attr("height", d => HEIGHT - y(d.height)) // using scaling function y
      .attr("y", d => y(d.height)); // start bars from bottom
  }
}
