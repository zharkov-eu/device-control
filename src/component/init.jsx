"use strict";

import { render } from "inferno";
import DimensionContainer from "./dimension/dimContainer";

import "../../public/src/css/normalize.css"
import "../../public/src/css/main.css"

render(<DimensionContainer/>, document.getElementById("app"));
