import { IElectronic, Coordinate, NodeType as NT } from './Electronic.d';
import GUIDGenerator from './GUIDGenerator';

export default class Electronic implements IElectronic {
  public id: string = GUIDGenerator();

  constructor(
    public name: string,
    public unit: string,
    public unitAbbrev: string,
    public value: number,
    public dimension: Array<Array<NT>>,
    public center: Coordinate,
    public coordinate: Coordinate,
  ) {}

  /* TODO: formal version like {value}{valueExponent}{unitAbbrev} */
  get valueStringified() {
    return this.value.toString();
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
  [[NT.Pin, NT.Occupied, NT.Pin]],
  [1, 0],
  coord,
);

const createDCSource = (coord: Coordinate) => new Electronic(
  'DC Source',
  'Volt',
  'V',
  10,
  [[NT.Pin, NT.Occupied, NT.Pin]],
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
