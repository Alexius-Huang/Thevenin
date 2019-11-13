import createAction from './createAction';

export const selectComponent = createAction<{
  name: string;
}>('SELECT_COMPONENT');

export const unselectComponent = createAction('UNSELECT_COMPONENT');
