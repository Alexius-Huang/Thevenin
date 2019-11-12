import createAction from './createAction';

export const selectTool = createAction<{
  name: string;
}>('SELECT_TOOL');

export const unselectTool = createAction('UNSELECT_TOOL');
