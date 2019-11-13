import createAction from './createAction';
import Electronic from '../lib/Electronic';

export const setSize = createAction<{
  height: number;
  width: number;
}>('SET_SIZE');

export const setSelectedComponentCoordinate = createAction<{
  coordinate: [number, number];
}>('SET_SELECTED_COMPONENT_COORDINATE');

export const unsetSelectedComponentCoordinate = createAction('UNSET_SELECTED_COMPONENT_COORDINATE');

export const appendElectronicComponent = createAction<Electronic>('APPEND_ELECTRONIC_COMPONENT');
