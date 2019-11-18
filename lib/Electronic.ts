import GUIDGenerator from './GUIDGenerator';
import ElectronicUnit, { ElectronicUnitType } from './Electronic.Unit';
import ElectronicInfos, { ElectronicInfo } from './Electronic.Info';
import { ConnectableDirection } from './circuit.lib';

export type Coordinate = [number, number];

export interface IElectronic {
  id: string;

  readonly name: string;
  readonly info: ElectronicInfo,
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
    public readonly name: string,
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

  private static rotatedElectronicUnitMap: {
    [key: string]: ElectronicUnit,
  } = {
    left: ElectronicUnit.TopPin,
    right: ElectronicUnit.BottomPin,
    top: ElectronicUnit.RightPin,
    bottom: ElectronicUnit.LeftPin,
  };
  private static rotatedElectronicUnitCreationMap: {
    [key: string]: (meta?: string) => ElectronicUnit,
  } = {
    left: ElectronicUnit.createTopPin,
    right: ElectronicUnit.createBottomPin,
    top: ElectronicUnit.createRightPin,
    bottom: ElectronicUnit.createLeftPin,
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
          if (eu.meta === '') {
            this.dimension[j][i] = Electronic.rotatedElectronicUnitMap[
              eu.connectDirection as ConnectableDirection
            ];  
          } else {
            this.dimension[j][i] = Electronic.rotatedElectronicUnitCreationMap[
              eu.connectDirection as ConnectableDirection
            ](eu.meta);
          }
        }

        newDimension[i][rows - 1 - j] = this.dimension[j][i];
      }
    }

    this.center = [rows - 1 - this.center[1], this.center[0]];
    this.dimension = newDimension;
  }
}

/* Electronic Component */
export enum EC {
  Ground,
  DCSource,
  Resistor,
}

const createDCSource = (coord: Coordinate) => new Electronic(
  'DC Source',
  10,
  [[ElectronicUnit.createLeftPin('POSITIVE'), ElectronicUnit.Occupied, ElectronicUnit.createRightPin('NEGATIVE')]],
  [1, 0],
  coord,
);

const createGround = (coord: Coordinate) => new Electronic(
  'Ground',
  NaN,
  [
    [ElectronicUnit.TopPin],
    [ElectronicUnit.Occupied],
  ],
  [0, 1],
  coord,
);

const createResistor = (coord: Coordinate) => new Electronic(
  'Resistor',
  1000,
  [[ElectronicUnit.LeftPin, ElectronicUnit.Occupied, ElectronicUnit.RightPin]],
  [1, 0],
  coord,
);

type ElectronicArgs = {
  coordinate: Coordinate;
};

export const createElectronic = (type: EC, args: ElectronicArgs): IElectronic => {
  const { coordinate: c } = args;

  switch (type) {
    case EC.Resistor: return createResistor(c);
    case EC.DCSource: return createDCSource(c);
    case EC.Ground:   return createGround(c);

    default:
      throw new Error(`${type} isn't registered!`);
  }
}
