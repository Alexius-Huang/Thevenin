import Electronic, { IElectronic, EC } from "../lib/Electronic";
import Circuit from "../lib/Circuit";

export enum ToolMode {
  NONE,
  ADD_COMPONENT,
}

export type ToolsStoreState = {
  mode: ToolMode;
  selectedComponent: EC | null;
}

export type WorkspaceStoreState = {
  width: number;
  height: number;
  unitSize: number;
  rows: number;
  columns: number;

  selectedComponent: {
    coordinate: [number, number] | null;
  };

  circuit: Circuit;
}

export type DestructuredStore = {
  Tools: ToolsStoreState;
  Workspace: WorkspaceStoreState;
};

type State = ToolsStoreState | WorkspaceStoreState;

export default State;
