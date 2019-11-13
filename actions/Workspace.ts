import createAction from './createAction';

export const setSize = createAction<{
  height: number;
  width: number;
}>('SET_SIZE');

export const setSelectedComponentCoordinate = createAction<{
  coordinate: [number, number];
}>('SET_SELECTED_COMPONENT_COORDINATE');

export const unsetSelectedComponentCoordinate = createAction('UNSET_SELECTED_COMPONENT_COORDINATE');
