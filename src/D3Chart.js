import * as d3 from 'd3';

const url = 'https://udemy-react-d3.firebaseio.com/tallest_men.json';
const WIDTH = 800;
const HEIGHT = 500;

export default class D3Chart {
  constructor(element) {
    const svg = d3.select(element)
      .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    d3.json(url).then(data => {
      // implementing scaling bars by axios y
      const y = d3.scaleLinear()
        // the highest height
        .domain([0, d3.max(data, d => d.height)])
        .range([0, HEIGHT])
        // console.log(y(100)) // return aprox 183

      // implementing scaling bars by axios x
      const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, WIDTH])
        .padding(0.4)

      const rects = svg.selectAll('rect')
        .data(data)

      rects.enter().append('rect')
        .attr('x', d => x(d.name)) // using scaling function x
        .attr('y', d => HEIGHT - y(d.height)) // start bars from bottom
        .attr('width', x.bandwidth)
        .attr('height', d => y(d.height)) // using scaling function y
        .attr('fill', 'grey')
    })
  }
}
