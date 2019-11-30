import { ReactNode } from 'react';
import { Action } from 'redux';
import { ToolMode } from '../../reducers/State';
import Electronic, { EC } from '../../lib/Circuit.Electronic';
import Circuit from '../../lib/Circuit';

export type Coordinate = [number, number];

export type WorkspaceProps = {
  unitSize: number;
  rows: number;
  columns: number;
  PC: Electronic | null; // Preview component
  PCIsValid: boolean;    // Previewed component is valid
  selectedComponent: EC | null;
  mode: ToolMode;
  circuit: Circuit;

  svgViewBox: string;
  workspaceTranslation: string;

  children: ReactNode;
  dispatch: (action: Action) => void;
};

export type WorkspaceState = {};
