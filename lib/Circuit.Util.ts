export function round(num: number, precision: number) {
  return Math.round(num * precision) / precision;
}

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

export function GUIDGenerator() {
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
