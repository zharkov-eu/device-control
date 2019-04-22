"use strict";

import { render } from "inferno";
import MetricContainer from "./metric/metricContainer";

import "../../public/src/css/main.css";

render(<MetricContainer/>, document.getElementById("app"));
