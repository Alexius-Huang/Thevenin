// import { createSelector } from 'reselect';
import { WorkspaceStoreState } from '../reducers/State';

export const svgViewBoxSelector =
  (state: WorkspaceStoreState) => `0 0 ${state.width} ${state.height}`;

export const workspaceTranslationSelector =
  (state: WorkspaceStoreState) => {
    const { width, height, rows, columns, unitSize, zoomScale, center } = state;

    return `
      translate(${[
        (width - (rows * unitSize * zoomScale)) / 2,
        (height - (columns * unitSize * zoomScale)) / 2,
      ]})
      scale(${zoomScale}, ${zoomScale})
    `.trim();
  };
