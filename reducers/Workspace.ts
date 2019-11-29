import * as actions from '../actions/Workspace';
import { reducerWithInitialState as createReducer } from 'typescript-fsa-reducers';
import State from './State.d';
import Circuit from '../lib/Circuit';
import Electronic, { createElectronic } from '../lib/Electronic';

const initialState: State = {
  circuit: new Circuit(10, 10),
  rows: 10,
  columns: 10,

  width: 0,
  height: 0,
  unitSize: 40,

  previewComponent: null,
  previewComponentIsValid: false,

  primaryWiringCoordinate: null,
};

export default createReducer(initialState)
  .case(actions.setSize, (state, { width, height}) => ({
    ...state,
    width,
    height,
  }))
  .case(actions.cancelAnyOperation, (state) => ({
    ...state,
    previewComponent: null,
    previewComponentIsValid: false,
    primaryWiringCoordinate: null,  
  }))

  /* Previewing & Attaching Component Actions */
  .case(actions.setPreviewComponent, (state, { type, coordinate }) => ({
    ...state,
    previewComponent: createElectronic(type, { coordinate }),
  }))
  .case(actions.unsetPreviewComponent, (state) => ({
    ...state,
    previewComponent: null,
    previewComponentIsValid: false,
  }))
  .case(actions.rotatePreviewComponent, (state) => {
    const PC = state.previewComponent;
    if (PC === null)
      throw new Error(`Preview component isn't existed, hence it can't be rotated!`);

    const electronic = createElectronic(PC.name, { coordinate: PC.coordinate });
    if (PC.rotations !== 3) {
      for (let i = 0; i < PC.rotations; i += 1) electronic.rotate();
      electronic.rotate();  
    }

    return { ...state, previewComponent: electronic };
  })
  .case(actions.validatePreviewComponentAttachability, (state) => ({
    ...state,
    previewComponentIsValid: state.circuit.canAttachComponent(state.previewComponent as Electronic),
  }))
  .case(actions.appendElectronicComponent, (state) => {
    if (state.previewComponent === null)
      throw new Error(`No previewed component is available to append into circuit!`);
    if (!state.previewComponentIsValid)
      throw new Error(`Preview component is not attachable to append to the circuit!`);

    state.circuit.appendElectronics(state.previewComponent);
    return { ...state, previewComponent: null, previewComponentIsValid: false };
  })
  
  /* Wiring Actions */
  .case(actions.setPrimaryWiringCoordinate, (state, payload) => ({
    ...state,
    primaryWiringCoordinate: payload,
  }));
