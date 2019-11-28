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

  previewComponent: {
    coordinate: null,
    isValid: false,
    rotations: 0,
  },

  circuit: new Circuit(10, 10),
};

export default createReducer(initialState)
  .case(actions.setSize, (state, { width, height}) => ({
    ...state,
    width,
    height,
  }))
  .case(actions.setPreviewComponentInfo, (state, payload) => ({
    ...state,
    previewComponent: {
      ...payload,
      rotations: payload.rotations || state.previewComponent.rotations,
    },
  }))
  .case(actions.unsetPreviewComponentInfo, (state) => ({
    ...state,
    previewComponent: {
      coordinate: null,
      isValid: false,
      rotations: 0,
    },
  }))
  .case(actions.rotatePreviewComponent, (state) => ({
    ...state,
    previewComponent: {
      ...state.previewComponent,
      rotations: (state.previewComponent.rotations === 3) ? 0 :
        (state.previewComponent.rotations + 1),
    }
  }))
  .case(actions.appendElectronicComponent, (state, payload) => {
    state.circuit.appendElectronics(payload);
    return { ...state };
  });
