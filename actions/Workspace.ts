import createAction from './createAction';

export const setSize = createAction<{
  height: number;
  width: number;
}>('SET_SIZE');
