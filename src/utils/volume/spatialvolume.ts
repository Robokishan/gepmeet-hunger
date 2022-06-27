// import { dimension, xy } from "../../types/canvasFB";
import { scale, sq } from "./misc";

export interface xy {
  x: number;
  y: number;
}

export function getDist(d1: xy, d2: xy) {
  let x1 = d1.x;
  let y1 = d1.y;
  let x2 = d2.x;
  let y2 = d2.y;
  return sq(x2 - x1) + sq(y2 - y1);
}

export function calcNewVolume(
  d1: xy,
  d2: xy,
  lower: number,
  upper: number,
  radius = 0
) {
  const dist = getDist(d1, d2) - sq(radius);
  const sqL = sq(lower);
  const sqU = sq(upper);
  if (dist < sqL) {
    return 1;
  } else if (dist > sqU) {
    return 0;
  } else {
    return 1 - scale(dist, sqL, sqU, 0, 1);
  }
}
