"use strict";

import { Component } from "inferno";

export default class MetricContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.createSocket()
    }
  }

  render() {
    return (
      <div className="a-container">
        <div className="a-header-wrap">
          <div className="grid a-header">
            <div className="grid__cell a-header__el">Параметр</div>
            <div className="grid__cell a-header__el">Значение</div>
            <div className="grid__cell a-header__el">15 мин.</div>
            <div className="grid__cell a-header__el">24 ч.</div>
          </div>
        </div>
      </div>
    );
  }

  createSocket() {
    const socket = new window.WebSocket(`ws://${document.location.host}/ws`);
    socket.onopen = () => socket.send("");
    socket.onmessage = (e) => {
      console.log(JSON.parse(e.data));
    };
    socket.onclose = (e) => {
      if (!e.wasClean) {
        console.log(`Обрыв соединения. Код: ${e.code}, причина: ${e.reason || 'не установлена'}`);
      } else if (e.code !== 1000) {
        console.log(`Завершено с ошибкой. Код: ${e.code}, причина: ${e.reason || 'не установлена'}`)
      } else {
        console.log('Успешно завершено');
      }
    };
  }
}
