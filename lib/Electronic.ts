import GUIDGenerator from './GUIDGenerator';
import ElectronicUnit, { ElectronicUnitType } from './Electronic.Unit';
import ElectronicInfos from './Electronic.Info';

export type Coordinate = [number, number];

/* Electronic Component */
export enum EC {
  Ground = 'Ground',
  DCSource = 'DC Source',
  Resistor = 'Resistor',
}

export default class Electronic {
  public id: string = GUIDGenerator();

  constructor(
    public readonly name: EC,
    public value: number,
    public dimension: Array<Array<ElectronicUnit>>,
    public center: Coordinate,
    public coordinate: Coordinate,
  ) {}

  /* TODO: formal version like {value}{valueExponent}{unitAbbrev} */
  get valueStringified() {
    return this.value.toString();
  }

  get info() { return ElectronicInfos[this.name]; }
  get type() { return this.info.type; }
  get unit() { return this.info.unit; }
  get unitPostfix() { return this.info.unitPostfix; }
  get pins() { return this.info.pins; }

  // Rotate clockwise
  public rotate() {
    const rows = this.dimension.length;
    const columns = this.dimension[0].length;
    const newDimension: Array<Array<ElectronicUnit>> = [];

    for (let i = 0; i < columns; i += 1) {
      newDimension.push([]);
      for (let j = 0; j < rows; j += 1) {
        const eu = this.dimension[j][i];
        if (eu.type === ElectronicUnitType.Pin) {
          eu.rotate();
        }

        newDimension[i][rows - 1 - j] = this.dimension[j][i];
      }
    }

    this.center = [rows - 1 - this.center[1], this.center[0]];
    this.dimension = newDimension;
  }

  public is(type: EC) { return this.name === type; }
}

const createDCSource = (coord: Coordinate) => new Electronic(
  EC.DCSource,
  10,
  [[ElectronicUnit.createPin('left', 'POSITIVE'), ElectronicUnit.Occupied, ElectronicUnit.createPin('right', 'NEGATIVE')]],
  [1, 0],
  coord,
);

const createGround = (coord: Coordinate) => new Electronic(
  EC.Ground,
  NaN,
  [
    [ElectronicUnit.createPin('top')],
    [ElectronicUnit.Occupied],
  ],
  [0, 1],
  coord,
);

const createResistor = (coord: Coordinate) => new Electronic(
  EC.Resistor,
  1000,
  [[ElectronicUnit.createPin('left', '1'), ElectronicUnit.Occupied, ElectronicUnit.createPin('right', '2')]],
  [1, 0],
  coord,
);

type ElectronicArgs = {
  coordinate: Coordinate;
};

export const createElectronic = (type: EC, args: ElectronicArgs): Electronic => {
  const { coordinate: c } = args;

  switch (type) {
    case EC.Resistor: return createResistor(c);
    case EC.DCSource: return createDCSource(c);
    case EC.Ground:   return createGround(c);

    default:
      throw new Error(`${type} isn't registered!`);
  }
}
