import * as actions from '../actions/Workspace';
import { reducerWithInitialState as createReducer } from 'typescript-fsa-reducers';
import State from './State.d';
import Circuit from '../lib/Circuit';

const initialState: State = {
  width: 0,
  height: 0,
  unitSize: 40,
  rows: 10,
  columns: 10,

  selectedComponent: {
    coordinate: null,
  },

  circuit: new Circuit(10, 10),
};

export default createReducer(initialState)
  .case(actions.setSize, (state, { width, height}) => ({
    ...state,
    width,
    height,
  }))
  .case(actions.setSelectedComponentCoordinate, (state, { coordinate }) => ({
    ...state,
    selectedComponent: {
      ...state.selectedComponent,
      coordinate,
    },
  }))
  .case(actions.unsetSelectedComponentCoordinate, (state) => ({
    ...state,
    selectedComponent: {
      ...state.selectedComponent,
      coordinate: null,
    },
  }))
  .case(actions.appendElectronicComponent, (state, payload) => {
    state.circuit.appendElectronics(payload);
    return { ...state };
  });
