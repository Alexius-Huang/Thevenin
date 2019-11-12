import { IElectronic } from "../lib/Electronic";

export type ToolsStoreState = {
  selectedTool: string | null;
}

export type WorkspaceStoreState = {
  width: number;
  height: number;
  unitSize: number;
  rows: number;
  columns: number;
}

type State = ToolsStoreState | WorkspaceStoreState;

export default State;
