import createAction from './createAction';
import Electronic, { EC } from '../lib/Electronic';

export const setSize = createAction<{
  height: number;
  width: number;
}>('SET_SIZE');

export const setPreviewComponent = createAction<{
  type: EC,
  coordinate: [number, number],
}>('SET_PREVIEW_COMPONENT');

export const validatePreviewComponentAttachability = createAction('VALIDATE_PREVIEW_COMPONENT_ATTACHABILITY');

export const rotatePreviewComponent = createAction('ROTATE_PREVIEW_COMPONENT');

export const unsetPreviewComponent = createAction('UNSET_PREVIEW_COMPONENT');

export const appendElectronicComponent = createAction('APPEND_ELECTRONIC_COMPONENT');
