import Electronic, { IElectronic, EC } from "../lib/Electronic";

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

  electronicComponents: Array<Electronic>;
}

export type DestructuredStore = {
  Tools: ToolsStoreState;
  Workspace: WorkspaceStoreState;
};

type State = ToolsStoreState | WorkspaceStoreState;

export default State;
