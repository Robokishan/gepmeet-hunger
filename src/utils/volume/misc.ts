import { xy } from "./spatialvolume";

export function findGetParameter(parameterName: string) {
  var result: undefined | string,
    tmp = [];
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

export function sq(x: number) {
  return Math.pow(x, 2);
}

export const scale = (
  num: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const getSpawnLocation = (listenerPosition: xy, radius: number) => {
  const getRandom = () => (Math.random() * 2 - 1) * radius;
  const x = listenerPosition.x + getRandom();
  const y = listenerPosition.y + getRandom();
  return { x, y };
};

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  delay: number
) {
  let inDebounce: NodeJS.Timeout;
  return function (...args: Params) {
    // @ts-ignore
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func(...args), delay);
  };
}

export function clip(val: number, low: number, high: number) {
  if (val > high) return high;
  if (val < low) return low;
  return val;
}
