import * as actions from '../actions/Tools';
import { reducerWithInitialState as createReducer } from 'typescript-fsa-reducers';
import State, { ToolMode } from './State.d';

const initialState: State = {
  selectedComponent: null,
  mode: ToolMode.NONE,
};

export default createReducer(initialState)
  .case(actions.selectComponent, (state, { name }) => ({
    ...state,
    selectedComponent: name,
    mode: ToolMode.ADD_COMPONENT,
  }))
  .case(actions.unselectComponent, (state) => ({
    ...state,
    selectedComponent: null,
    mode: ToolMode.NONE,
  }));
