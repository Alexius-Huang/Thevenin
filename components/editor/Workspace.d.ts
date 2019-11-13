import { ReactNode } from 'react';
import { Action } from 'redux';
import { ToolMode } from '../../reducers/State';

export type Coordinate = [number, number];

export type WorkspaceProps = {
  unitSize: number;
  rows: number;
  columns: number;
  selectedComponentCoordinate: Coordinate | null;
  selectedComponent: string | null;
  toolMode: ToolMode;

  svgViewBox: string;
  workspaceTranslation: string;

  children: ReactNode;
  dispatch: (action: Action) => void;
};

export type WorkspaceState = {};
