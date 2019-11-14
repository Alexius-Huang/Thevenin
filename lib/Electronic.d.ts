export type Coordinate = [number, number];

export enum NodeType {
  Occupied,
  Pin,
};

export interface IElectronic {
  id: string;

  name: string;
  unit: string;
  unitAbbrev: string;
  value: number;
  valueStringified: string;

  /* The occupied state of the component */
  dimension: Array<Array<NodeType>>;

  /* Center is the coordinate with respect to dimension */
  center: Coordinate,

  /* Coordinate according to the workspace corordinate system */
  coordinate: Coordinate;
}
