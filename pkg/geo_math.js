/* @ts-self-types="./geo_math.d.ts" */

import * as wasm from "./geo_math_bg.wasm";
import { __wbg_set_wasm } from "./geo_math_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    distance
} from "./geo_math_bg.js";
