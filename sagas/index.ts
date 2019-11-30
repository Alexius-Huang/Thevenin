import { all, takeLatest } from 'redux-saga/effects';
import CircuitSimulationTransaction from './CircuitSimulation';

export default function* RootSaga() {
  yield all([
    takeLatest('CIRCUIT_SIMULATION_START', CircuitSimulationTransaction),
  ]);
}
