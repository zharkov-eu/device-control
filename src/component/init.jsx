"use strict";

import "core-js/features/object/values";
import "core-js/features/symbol";

import { render } from "inferno";
import MetricContainer from "./metric/metricContainer";

import "simplebar/dist/simplebar.css";
import "../../public/src/css/main.css";

render(<MetricContainer/>, document.getElementById("app"));
