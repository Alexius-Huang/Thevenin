import createAction from './createAction';
import Electronic from '../lib/Electronic';

export const setSize = createAction<{
  height: number;
  width: number;
}>('SET_SIZE');

export const setPreviewComponentInfo = createAction<{
  coordinate: [number, number];
  isValid: boolean;
  rotations?: number;
}>('SET_PREVIEW_COMPONENT_INFO');

export const rotatePreviewComponent = createAction('ROTATE_PREVIEW_COMPONENT');

export const unsetPreviewComponentInfo = createAction('UNSET_PREVIEW_COMPONENT_INFO');

export const appendElectronicComponent = createAction<Electronic>('APPEND_ELECTRONIC_COMPONENT');
