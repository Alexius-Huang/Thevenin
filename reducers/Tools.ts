import * as actions from '../actions/Tools';
import { reducerWithInitialState as createReducer } from 'typescript-fsa-reducers';
import State, { ToolMode } from './State.d';
import { EC } from '../lib/Circuit.Electronic';

const initialState: State = {
  selectedComponent: null,
  mode: ToolMode.NONE,
};

export default createReducer(initialState)
  .case(actions.selectComponent, (state, { name }: { name: EC }) => ({
    ...state,
    selectedComponent: name,
    mode: ToolMode.ADD_COMPONENT,
  }))
  .case(actions.unselectComponent, (state) => ({
    ...state,
    selectedComponent: null,
    mode: ToolMode.NONE,
  }))
  .case(actions.enableAddWireMode, (state) => ({
    ...state,
    selectedComponent: null,
    mode: ToolMode.ADD_WIRE,
  }))
  .case(actions.disableAddWireMode, (state) => ({
    ...state,
    mode: ToolMode.NONE,
  }))
  .case(actions.cancelAnyOperation, () => ({
    selectedComponent: null,
    mode: ToolMode.NONE
  }));
