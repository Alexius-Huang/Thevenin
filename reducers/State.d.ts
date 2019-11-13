import { IElectronic } from "../lib/Electronic";

export enum ToolMode {
  NONE,
  ADD_COMPONENT,
}

export type ToolsStoreState = {
  mode: ToolMode;
  selectedComponent: string | null;
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
}

export type DestructuredStore = {
  Tools: ToolsStoreState;
  Workspace: WorkspaceStoreState;
};

type State = ToolsStoreState | WorkspaceStoreState;

export default State;
