import Circuit from "../lib/Circuit";
import Electronic, { Coordinate, EC, createElectronic } from "../lib/Electronic";

const AbbrevECMap = new Map<string, EC>([
  ['R', EC.Resistor],
  ['DCV', EC.DCSource],
  ['GND', EC.Ground],
])
export function setElectronics(
  circuit: Circuit,
  info: Array<[
    string,
    string,
    [number, number],
    number?,
    number?,
  ]>
): { [key: string]: Electronic } {
  const result: { [key: string]: Electronic } = {};

  for (let [name, abbrev, coordinate, value = NaN, rotations = 0] of info) {
    const e = createElectronic(AbbrevECMap.get(abbrev) as EC, { coordinate });
    if (!Number.isNaN(value))
      e.value = value;
    if (rotations !== 0)
      for (let i = 0; i < rotations; i += 1)
        e.rotate();

    circuit.appendElectronics(e);
    result[name] = e;
  }

  return result;
}

export function setPaths(circuit: Circuit, paths: Array<Array<Coordinate>>) {
  for (let p of paths) {
    setPath(circuit, p);
  }
}

export function setPath(circuit: Circuit, coordinates: Array<Coordinate>) {
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    circuit.addJoint(coordinates[i], coordinates[i + 1]);
  }
}
