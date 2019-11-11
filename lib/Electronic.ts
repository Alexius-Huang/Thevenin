import { IElectronic } from './Electronic.d';

export default class Electronic implements IElectronic {
  constructor(
    public name: string,
    public unit: string,
    public unitAbbrev: string,
    public value: number,
    public dimension: [number, number],
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

const createResistor = () => new Electronic(
  'Resistor',
  'Ohms',
  'Ω',
  1000,
  [1, 3]
);

const createDCSource = () => new Electronic(
  'DC Source',
  'Volt',
  'V',
  10,
  [1, 3]
)

export const createElectronic = (type: EC): IElectronic => {
  switch (type) {
    case EC.Resistor: return createResistor();
    case EC.DCSource: return createDCSource();

    default:
      throw new Error(`${type} isn't registered!`);
  }
}
