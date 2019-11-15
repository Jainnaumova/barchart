import * as d3 from 'd3';

const url = 'https://udemy-react-d3.firebaseio.com/tallest_men.json';
const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
  constructor(element) {
    const vis = this;

    vis.svg = d3.select(element)
      .append('svg')
        .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append('g') // append group
        .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    // x axios label
    vis.svg.append('text')
      .attr('x', WIDTH / 2)
      .attr('y', HEIGHT + 50)
      .attr('text-anchor', 'middle')
      .text('The world\'s tallest men')

    // y axios label
    vis.svg.append('text')
      .attr('x', -(HEIGHT / 2))
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .text('Height in cm')
      .attr('transform', 'rotate(-90)')

    // add X and Y axises group once
    vis.xAxisGroup = vis.svg.append('g')
      .attr('transform', `translate(0, ${HEIGHT})`) // move x axis to the bottom

    vis.yAxisGroup = vis.svg.append('g')

    // fetch data and then call update method
    d3.json(url).then(data => {
      vis.data = data;
      // set interval in order to update visualization
      d3.interval(() => {
        vis.update()
      }, 1000)

    })
  }

  // update method
  update() {
    const vis = this;
    // implementing scaling bars by axios y
    const y = d3.scaleLinear()
      .domain([
        d3.min(vis.data, d => d.height) * 0.95,
        d3.max(vis.data, d => d.height)])
      .range([HEIGHT, 0])
      // console.log(y(100)) // return aprox 183

    // implementing scaling bars by axios x
    const x = d3.scaleBand()
      .domain(vis.data.map(d => d.name))
      .range([0, WIDTH])
      .padding(0.4)

    // recalculate X and Y axises in order to update
    const xAxisCall = d3.axisBottom(x);
    vis.xAxisGroup.call(xAxisCall)

    const yAxisCall = d3.axisLeft(y);
    vis.yAxisGroup.call(yAxisCall);

    // DATA JOIN tells d3 which array of data we want to associate with our data
    const rects = vis.svg.selectAll('rect')
      .data(vis.data)

    // EXIT remove elements that display on the screen but not exist in the new array of data
    rects.exit().remove();

    // UPDATE data that exist in the new array and display on the screen
    rects
      .attr('x', d => x(d.name)) // using scaling function x
      .attr('y', d => y(d.height)) // start bars from bottom
      .attr('width', x.bandwidth)
      .attr('height', d => HEIGHT - y(d.height)) // using scaling function y

    // ENTER append attributes that does not exist in our data and on the screen
    rects.enter().append('rect')
      .attr('x', d => x(d.name)) // using scaling function x
      .attr('y', d => y(d.height)) // start bars from bottom
      .attr('width', x.bandwidth)
      .attr('height', d => HEIGHT - y(d.height)) // using scaling function y
      .attr('fill', 'grey')

    console.log(rects)
  }
}
