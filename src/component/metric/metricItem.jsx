"use strict";

import { Component } from "inferno";

class MetricAbstract extends Component {
  constructor(props) {
    super(props);
    const { metric } = props;
    this.state = { editable: metric.access === "W", editing: false };
  }

  toggleEdit(e) {
    e.preventDefault();
    const { editing } = this.state;
    this.setState({ editing: !editing });
    if (!editing) {
      const { metric } = this.props;
      const input = document.getElementById("m-" + metric.name + "_value");
      if (input) input.focus();
    }
  }

  onInput(e) {
    const { update } = this.props;
    update(e.target.value);
  }
}

export class MetricItem extends MetricAbstract {
  render() {
    const { metric, related } = this.props;
    const { editable, editing } = this.state;
    const expanded = related.length;

    return (
      <div id={"m-" + metric.name} className={"a-metric" + (expanded ? " a-metric_expand" : "")}>
        <div className="grid grid--flush grid--middle">
          <div className="9/24 grid__cell">
            <h3 className="a-metric__name">{metric.name}{metric.measureUnit ? ", " + metric.measureUnit : ""}</h3>
            <p className="a-metric__desc">{metric.description}</p>
          </div>
          <div className="5/24 grid__cell grid__cell_center">
            <input id={"m-" + metric.name + "_value"} className="a-metric__value" type="text"
                   value={metric.value} disabled={!editing} onInput={this.onInput.bind(this)}/>
          </div>
          <div className="6/24 grid__cell"/>
          <div className="4/24 grid__cell a-metric-icons">
            {editable
              ? <i className={"icon-edit" + (editing ? " icon-edit_active" : "")}
                   onClick={this.toggleEdit.bind(this)}/>
              : undefined}
            {metric.relations.length
              ? <i className={"icon-more" + (expanded ? " icon-more_expand" : "")}
                   onClick={expanded ? this.closeHandler.bind(this) : this.expandHandler.bind(this)}/>
              : undefined}
          </div>
        </div>
        {expanded ? <div className="a-metric-related-container">{related}</div> : undefined}
      </div>
    )
  }

  closeHandler(e) {
    e.preventDefault();
    this.props.close();
  }

  expandHandler(e) {
    e.preventDefault();
    this.props.expand();
  }
}

export class MetricRelated extends MetricAbstract {
  render() {
    const { metric } = this.props;
    const { editable, editing } = this.state;

    return (
      <div className="a-metric-related">
        <div className="grid grid--flush grid--middle">
          <div className="8/24 grid__cell">
          </div>
          <div className="6/24 grid__cell grid__cell_center">
            <h3 className="a-metric-related__name">
              {metric.name}{metric.measureUnit ? ", " + metric.measureUnit : ""}
            </h3>
          </div>
          <div className="1/24 grid__cell"/>
          <div className="4/24 grid__cell">
            <input id={"m-" + metric.name + "_value"} className="a-metric-related__value" type="text"
                   value={metric.value} disabled={!editing} onInput={this.onInput.bind(this)}/>
          </div>
          <div className="5/24 grid__cell a-metric-icons">
            {editable
              ? <i className={"icon-edit" + (editing ? " icon-edit_active" : "")}
                   onClick={this.toggleEdit.bind(this)}/>
              : undefined}
          </div>
        </div>
      </div>
    )
  }
}
