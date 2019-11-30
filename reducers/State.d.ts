import Electronic, { EC } from "../lib/Electronic";
import Circuit from "../lib/Circuit";

export enum ToolMode {
  NONE,
  ADD_COMPONENT,
  ADD_WIRE,
}

export enum SimulationStatus {
  PENDING,
  SUCCESS,
  ERROR,
}

export type ToolsStoreState = {
  mode: ToolMode;
  selectedComponent: EC | null;
}

export type WorkspaceStoreState = {
  circuit: Circuit;
  rows: number;
  columns: number;

  width: number;
  height: number;
  unitSize: number;
  zoomScale: number;
  center: [number, number];

  /* To-be Attached Component Previewing */
  previewComponent: Electronic | null;
  previewComponentIsValid: boolean;

  /* Wiring */
  primaryWiringCoordinate: [number, number] | null;

  /* Simulation Status */
  simulation: {
    status: SimulationStatus;
    errorMessage: string | null;
  };
}

export type DestructuredStore = {
  Tools: ToolsStoreState;
  Workspace: WorkspaceStoreState;
};

type State = ToolsStoreState | WorkspaceStoreState;

export default State;
