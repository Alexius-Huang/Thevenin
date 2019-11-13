import createAction from './createAction';
import { EC } from '../lib/Electronic';

export const selectComponent = createAction<{
  name: EC;
}>('SELECT_COMPONENT');

export const unselectComponent = createAction('UNSELECT_COMPONENT');
