import Electronic, { EC } from "../lib/Electronic";
import Circuit from "../lib/Circuit";

export enum ToolMode {
  NONE,
  ADD_COMPONENT,
  ADD_WIRE,
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

  previewComponent: {
    coordinate: [number, number] | null;
    isValid: boolean;
    rotations: number;
  };

  circuit: Circuit;
}

export type DestructuredStore = {
  Tools: ToolsStoreState;
  Workspace: WorkspaceStoreState;
};

type State = ToolsStoreState | WorkspaceStoreState;

export default State;
