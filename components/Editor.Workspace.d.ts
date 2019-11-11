import { ReactNode } from 'react';
import { Action } from 'redux';

export type Coordinate = [number, number];

export type WorkspaceProps = {
  width: number;
  height: number;
  unitSize: number;
  rows: number;
  columns: number;
  children: ReactNode;
  dispatch: (action: Action) => void;
};

export type WorkspaceState = {};
