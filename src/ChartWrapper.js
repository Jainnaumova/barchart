import React, { Component } from "react";
import D3Chart from "./D3Chart";

export default class ChartWrapper extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     gender: "men"
  //   };
  // }

  componentDidMount() {
    this.setState({
      chart: new D3Chart(this.refs.chart)
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate() {
    // debugger;
    // console.log(this.state);
    // if (prevProps.gender !== this.props.gender) {
    this.state.chart.update(this.props.gender);
    // }
  }

  render() {
    return <div ref="chart"></div>;
  }
}
