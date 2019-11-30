import { put, select } from 'redux-saga/effects';
import { WorkspaceStoreState } from '../reducers/State';
import * as actions from '../actions/Workspace';

export default function* CircuitSimulationTransaction() {
  const state = (yield select(state => state.Workspace)) as WorkspaceStoreState;
  const circuit = state.circuit;

  try {
    circuit.run();
  } catch (err) {
    yield put(actions.circuitSimulationError(err));
    return;    
  }

  yield put(actions.circuitSimulationSuccess());
}
