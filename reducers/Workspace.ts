import * as actions from '../actions/Workspace';
import { reducerWithInitialState as createReducer } from 'typescript-fsa-reducers';
import State, { SimulationStatus } from './State.d';
import Circuit from '../lib/Circuit';
import Electronic, { createElectronic } from '../lib/Electronic';

const initialState: State = {
  circuit: new Circuit(7, 7),
  rows: 7,
  columns: 7,

  width: 0,
  height: 0,
  unitSize: 40,
  zoomScale: 1.5,
  center: [0, 0],

  previewComponent: null,
  previewComponentIsValid: false,

  primaryWiringCoordinate: null,

  simulation: {
    status: SimulationStatus.PENDING,
    errorMessage: null,
  },
};

export default createReducer(initialState)
  .case(actions.setSize, (state, { width, height}) => ({
    ...state,
    width,
    height,
  }))
  .case(actions.setCenter, (state, payload) => ({
    ...state,
    center: payload,
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
  }))
  .case(actions.attachWire, (state, payload) => {
    if (state.primaryWiringCoordinate === null)
      throw new Error('Cannot attach wire without primary wiring coordinate');

    state.circuit.addJoint(state.primaryWiringCoordinate, payload);
    return {
      ...state,
      primaryWiringCoordinate: payload,
    };
  })

  /* Simulation Actions */
  .case(actions.startCircuitSimulation, (state) => {
    state.circuit.run();
    return { ...state };
  });
