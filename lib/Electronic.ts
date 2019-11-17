import GUIDGenerator from './GUIDGenerator';
import ElectronicUnit, { ElectronicUnitType } from './Electronic.Unit';
import { ConnectableDirection } from './circuit.lib';

export type Coordinate = [number, number];

// Node Type
// export enum NT {
//   Occupied,
//   Pin,
// };

// export enum ElectronicUnit {
//   Occupied,
//   Pin,
// }

export interface IElectronic {
  id: string;

  name: string;
  unit: string;
  unitAbbrev: string;
  value: number;
  valueStringified: string;

  /* The occupied state of the component */
  dimension: Array<Array<ElectronicUnit>>;

  /* Center is the coordinate with respect to dimension */
  center: Coordinate,

  /* Coordinate according to the workspace corordinate system */
  coordinate: Coordinate;

  /* Rotate in clockwise */
  rotate(): void;
}

export default class Electronic implements IElectronic {
  public id: string = GUIDGenerator();

  constructor(
    public name: string,
    public unit: string,
    public unitAbbrev: string,
    public value: number,
    public dimension: Array<Array<ElectronicUnit>>,
    public center: Coordinate,
    public coordinate: Coordinate,
  ) {}

  /* TODO: formal version like {value}{valueExponent}{unitAbbrev} */
  get valueStringified() {
    return this.value.toString();
  }

  private static rotatedElectronicUnitMap: {
    [key: string]: ElectronicUnit,
  } = {
    left: ElectronicUnit.TopPin,
    right: ElectronicUnit.BottomPin,
    top: ElectronicUnit.RightPin,
    bottom: ElectronicUnit.LeftPin,
  };

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
          this.dimension[j][i] = Electronic.rotatedElectronicUnitMap[
            eu.connectDirection as ConnectableDirection
          ];
        }

        newDimension[i][rows - 1 - j] = this.dimension[j][i];
      }
    }

    this.dimension = newDimension;
  }
}

/* Electronic Component */
export enum EC {
  Resistor,
  DCSource,
}

const createResistor = (coord: Coordinate) => new Electronic(
  'Resistor',
  'Ohms',
  'Ω',
  1000,
  [[ElectronicUnit.LeftPin, ElectronicUnit.Occupied, ElectronicUnit.RightPin]],
  [1, 0],
  coord,
);

const createDCSource = (coord: Coordinate) => new Electronic(
  'DC Source',
  'Volt',
  'V',
  10,
  [[ElectronicUnit.LeftPin, ElectronicUnit.Occupied, ElectronicUnit.RightPin]],
  [1, 0],
  coord,
)

type ElectronicArgs = {
  coordinate: Coordinate;
};

export const createElectronic = (type: EC, args: ElectronicArgs): IElectronic => {
  const { coordinate: c } = args;

  switch (type) {
    case EC.Resistor: return createResistor(c);
    case EC.DCSource: return createDCSource(c);

    default:
      throw new Error(`${type} isn't registered!`);
  }
}
