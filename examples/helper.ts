import Circuit from '../lib/Circuit';
import Electronic, { Coordinate, EC, createElectronic } from '../lib/Electronic';
import Unit from '../lib/Circuit.Unit';
import { ConnectableDirection } from '../lib/circuit.lib';

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

export function createLayout(dimension: [number, number]) {
  const layout = Array.from(Array(dimension[1])).map(() =>
    Array.from(Array(dimension[0])).map(() => new Unit())
  );

  let targetedUnitCoord: [number, number];
  // let targetConnection: Connection;

  const obj = {
    unit(coordinate: [number, number]) {
      targetedUnitCoord = coordinate;
      return obj;
    },
    voltage(value: number) {
      const [col, row] = targetedUnitCoord;
      layout[row][col].voltage = value;
      return obj;
    },
    connectUnit([col2, row2]: [number, number]) {
      const [col1, row1] = targetedUnitCoord;
      let direction: ConnectableDirection;
      if (col2 - col1 === 0)
        direction = (row2 - row1 === 1) ? 'bottom' : 'top';
      else
        direction = (col2 - col1 === 1) ? 'right' : 'left';

      const currentUnit = layout[row1][col1];
      const connectedUnit = layout[row2][col2];
      currentUnit.connect(direction, connectedUnit);
      connectedUnit.voltage = currentUnit.voltage;

      return obj;
    },

    connectToUnit(coord: [number, number]) {
      obj.connectUnit(coord);
      obj.unit(coord);
      return obj;
    },

    wire(coords: Array<[number, number]>) {
      coords.forEach(coord => obj.connectToUnit(coord));

      return {
        to(coord: [number, number]) {
          obj.connectToUnit(coord);
          return obj;
        },
      };
    },

    connectAlongUnits(coords: Array<[number, number]>) {
      coords.forEach(coord => obj.connectToUnit(coord));
      return obj;
    },

    connectElectronic(
      direction: ConnectableDirection,
      electronic: Electronic,
      pinName: string,
    ) {
      const [col, row] = targetedUnitCoord;
      const unit = layout[row][col];
      unit.connect(direction, { electronic, pinName });
      return obj;
    },

    is(electronic: Electronic) {
      const [col1, row1] = targetedUnitCoord;
      layout[row1][col1].setElectronic(electronic.id);
      return obj;
    },

    withElectronic(electronic: Electronic) {
      const { coordinate: [col, row], id } = electronic;
      layout[row][col].setElectronic(id);
      return obj;
    },

    withElectronics(electronics: Array<Electronic>) {
      electronics.forEach(e => obj.withElectronic(e));
      return obj;
    },

    left: { is(e: Electronic, pinName: string) {
      obj.connectElectronic('left', e, pinName);
      return obj;
    }, },
    right: { is(e: Electronic, pinName: string) {
      obj.connectElectronic('right', e, pinName);
      return obj;
    }, },
    top: { is(e: Electronic, pinName: string) {
      obj.connectElectronic('top', e, pinName);
      return obj;
    }, },
    bottom: { is(e: Electronic, pinName: string) {
      obj.connectElectronic('bottom', e, pinName);
      return obj;
    }, },

    result: layout,
  };

  return obj;
}
