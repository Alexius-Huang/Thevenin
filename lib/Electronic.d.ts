export type Coordinate = [number, number];

export enum NodeType {
  Occupied,
  Pin,
};

export interface IElectronic {
  name: string;
  unit: string;
  unitAbbrev: string;
  value: number;
  valueStringified: string;
  dimension: Array<Array<NodeType>>;
  coordinate: Coordinate;
}
