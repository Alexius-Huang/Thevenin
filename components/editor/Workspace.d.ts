import { ReactNode } from 'react';
import { Action } from 'redux';
import { ToolMode } from '../../reducers/State';
import { EC } from '../../lib/Electronic';
import Circuit from '../../lib/Circuit';

export type Coordinate = [number, number];

export type WorkspaceProps = {
  unitSize: number;
  rows: number;
  columns: number;
  previewComponent: {
    coordinate: Coordinate | null;
    isValid: boolean;
    rotations: number;
  };
  selectedComponent: EC | null;
  toolMode: ToolMode;
  circuit: Circuit;

  svgViewBox: string;
  workspaceTranslation: string;

  children: ReactNode;
  dispatch: (action: Action) => void;
};

export type WorkspaceState = {};
