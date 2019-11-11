import { IElectronic } from "../lib/Electronic";

type WorkspaceState = {
  width: number;
  height: number;
  unitSize: number;
  rows: number;
  columns: number;

  electronics: Array<IElectronic>;
}

type State = WorkspaceState;

export default State;
