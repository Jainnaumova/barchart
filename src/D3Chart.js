import * as d3 from 'd3';

const url = 'https://udemy-react-d3.firebaseio.com/tallest_men.json';
const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
  constructor(element) {
    const svg = d3.select(element)
      .append('svg')
        .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append('g') // append group
        .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    d3.json(url).then(data => {
      // implementing scaling bars by axios y
      const y = d3.scaleLinear()
        // the highest height
        .domain([
          d3.min(data, d => d.height) * 0.95,
          d3.max(data, d => d.height)])
        .range([HEIGHT, 0])
        // console.log(y(100)) // return aprox 183

      // implementing scaling bars by axios x
      const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, WIDTH])
        .padding(0.4)

      const xAxisCall = d3.axisBottom(x);
      svg.append('g') // append group
        .attr('transform', `translate(0, ${HEIGHT})`) // move x axis to the bottom
        .call(xAxisCall)

      const yAxisCall = d3.axisLeft(y);
      svg.append('g').call(yAxisCall) // append group

      // x axios label
      svg.append('text')
        .attr('x', WIDTH / 2)
        .attr('y', HEIGHT + 50)
        .attr('text-anchor', 'middle')
        .text('The world\'s tallest men')

      // y axios label
      svg.append('text')
        .attr('x', -(HEIGHT / 2))
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Height in cm')
        .attr('transform', 'rotate(-90)')

      const rects = svg.selectAll('rect')
        .data(data)

      rects.enter().append('rect')
        .attr('x', d => x(d.name)) // using scaling function x
        .attr('y', d => y(d.height)) // start bars from bottom
        .attr('width', x.bandwidth)
        .attr('height', d => HEIGHT - y(d.height)) // using scaling function y
        .attr('fill', 'grey')
    })
  }
}
