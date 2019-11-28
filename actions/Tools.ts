import createAction from './createAction';
import { EC } from '../lib/Electronic';

export const selectComponent = createAction<{
  name: EC;
}>('SELECT_COMPONENT');

export const unselectComponent = createAction('UNSELECT_COMPONENT');

export const enableAddWireMode = createAction('ENABLE_ADD_WIRE_MODE');

export const disableAddWireMode = createAction('DISABLE_ADD_WIRE_MODE');

export const cancelAnyOperation = createAction('CANCEL_ANY_OPERATIONS');
