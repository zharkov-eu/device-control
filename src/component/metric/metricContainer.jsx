"use strict";

import SimpleBar from "simplebar";
import { Component } from "inferno";
import { MetricItem, MetricRelated } from "./metricItem";

export default class MetricContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 0,
      metricMap: {},
      metricExpanded: [],
      socket: this.createSocket()
    }
  }

  componentDidMount() {
    const container = document.getElementById("a-metric-scroll");
    if (container) new SimpleBar(container, { autoHide: false });
  }

  render() {
    const { metricMap, metricExpanded } = this.state;
    const metrics = Object.values(metricMap);
    const metricItems = [];
    for (const metric of metrics.filter(it => it.level === 0)) {
      const isExpanded = metricExpanded.indexOf(metric.name) !== -1;
      const related = isExpanded
        ? metric.relations.filter(name => metricMap[name])
          .map(name => <MetricRelated metric={metricMap[name]} update={(value) => this.updateMetric(name, value)}/>)
        : [];

      metricItems.push(<MetricItem metric={metric} related={related}
                                   close={() => this.close(metric.name)}
                                   expand={() => this.expand(metric.name)}
                                   update={(value) => this.updateMetric(metric.name, value)}/>);
    }

    return (
      <div className="a-container">
        <div className="a-header">
          <div className="grid grid--flush grid--middle">
            <div className="9/24 grid__cell">Параметр</div>
            <div className="5/24 grid__cell grid__cell_center">Значение</div>
            <div className="3/24 grid__cell grid__cell_center">15 мин.</div>
            <div className="3/24 grid__cell grid__cell_center">24 ч.</div>
            <div className="4/24 grid__cell grid__cell_center"/>
          </div>
        </div>
        <div id="a-metric-scroll" className="a-metric-scroll">
          <div id="a-metric-container" className="a-metric-container">
            {metricItems}
          </div>
        </div>
      </div>
    );
  }

  createSocket() {
    const socket = new window.WebSocket(`ws://${document.location.host}/ws`);
    socket.onopen = () => this.queryMetrics({});
    socket.onmessage = this.handleResponse.bind(this);
    socket.onclose = (e) => {
      if (!e.wasClean)
        console.error(`Connection lost. Code: ${e.code}, reason: ${e.reason || "not recognized"}`);
      else if (e.code !== 1000)
        console.error(`Closed with error. Code: ${e.code}, reason: ${e.reason || "not recognized"}`);
    };
    return socket;
  }

  close(name) {
    const { metricExpanded } = this.state;
    const index = metricExpanded.indexOf(name);
    if (index !== -1) {
      const expanded = [...metricExpanded];
      expanded.splice(index, 1);
      this.setState({ metricExpanded: expanded });
    }
  }

  expand(name) {
    const { metricExpanded } = this.state;
    this.queryMetrics({ expanded: [name] });
    this.setState({ metricExpanded: [...metricExpanded, name] });
  }

  updateMetric(name, value) {
    const { socket, metricMap } = this.state;
    const metric = metricMap[name];
    if (metric) {
      socket.send(JSON.stringify({ target: "update", payload: { name, value } }));
      this.setState({ metricMap: { ...metricMap, [name]: { ...metric, value } } });
    }
  }

  queryMetrics(query) {
    const { socket } = this.state;
    socket.send(JSON.stringify({ target: "query", payload: query }));
  }

  handleResponse(e) {
    const { state, metrics } = JSON.parse(e.data);
    const { metricMap } = { ...this.state };
    for (const metric of metrics)
      metricMap[metric.name] = metric;
    this.setState({ state, metricMap });
  }
}
