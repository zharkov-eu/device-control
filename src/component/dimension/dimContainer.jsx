"use strict";

import { Component } from "inferno";

export default class DimensionContainer extends Component {
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
}
