"use strict";

import { Component } from "inferno";

export default class MetricItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { metric } = this.props;
    return (
      <div className="a-metric">
        <div className="grid grid--flush grid--middle">
          <div className="9/24 grid__cell">
            <h3 className="a-metric__name">{metric.name}{metric.measureUnit ? ", " + metric.measureUnit : ""}</h3>
            <p className="a-metric__desc">{metric.description}</p>
          </div>
          <div className="5/24 grid__cell grid__cell_center">
            <input className="a-metric__value" type="text" value={metric.value}/>
          </div>
          <div className="6/24 grid__cell"/>
          <div className="4/24 grid__cell a-metric-icons">
            {metric.access === "W" ? <i className="icon-edit"/> : undefined}
            <i className="icon-more"/>
          </div>
        </div>
      </div>
    )
  }
}
