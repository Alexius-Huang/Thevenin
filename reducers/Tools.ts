import * as actions from '../actions/Tools';
import { reducerWithInitialState as createReducer } from 'typescript-fsa-reducers';
import State from './State.d';

const initialState: State = {
  selectedTool: null,
};

export default createReducer(initialState)
  .case(actions.selectTool, (state, { name }) => ({
    ...state,
    selectedTool: name,
  }))
  .case(actions.unselectTool, (state) => ({
    ...state,
    selectedTool: null,
  }));
