"use strict";

import { Component } from "inferno";
import MetricItem from "./metricItem";
import { initScrollbar } from "../lib/scrollbar";

export default class MetricContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 0,
      metricMap: {},
      metricUnwrap: {},
      socket: this.createSocket()
    }
  }

  componentDidMount() {
    const container = document.getElementById("a-metric-scroll");
    if (container) initScrollbar(container);
  }

  render() {
    const { metricMap } = this.state;
    const metrics = Object.values(metricMap);
    const metricItems = metrics.filter(it => it.level === 0).map(it => <MetricItem metric={it}/>);

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
        <div id="a-metric-scroll" className="overflow a-metric-scroll">
          <div id="a-metric-container" className="a-metric-container">
            {metricItems}
          </div>
        </div>
      </div>
    );
  }

  createSocket() {
    const socket = new window.WebSocket(`ws://${document.location.host}/ws`);
    socket.onopen = () => socket.send("{}");
    socket.onmessage = (e) => {
      const { state, metrics } = JSON.parse(e.data);
      const { metricMap } = { ...this.state };
      for (const metric of metrics)
        metricMap[metric.name] = metric;
      this.setState({ state, metricMap });
    };
    socket.onclose = (e) => {
      if (!e.wasClean)
        console.log(`Обрыв соединения. Код: ${e.code}, причина: ${e.reason || 'не установлена'}`);
      else if (e.code !== 1000)
        console.log(`Завершено с ошибкой. Код: ${e.code}, причина: ${e.reason || 'не установлена'}`)
      else
        console.log('Успешно завершено');
    };
  }
}
