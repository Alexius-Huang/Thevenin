import createAction from './createAction';
import { EC } from '../lib/Circuit.Electronic';

export const setSize = createAction<{
  height: number;
  width: number;
}>('SET_SIZE');

export const setCenter = createAction<[number, number]>('SET_CENTER');

export const cancelAnyOperation = createAction('CANCEL_ANY_OPERATION');

/* Previewing & Attaching Component Actions */
export const setPreviewComponent = createAction<{
  type: EC,
  coordinate: [number, number],
}>('SET_PREVIEW_COMPONENT');

export const validatePreviewComponentAttachability = createAction('VALIDATE_PREVIEW_COMPONENT_ATTACHABILITY');

export const rotatePreviewComponent = createAction('ROTATE_PREVIEW_COMPONENT');

export const unsetPreviewComponent = createAction('UNSET_PREVIEW_COMPONENT');

export const appendElectronicComponent = createAction('APPEND_ELECTRONIC_COMPONENT');

/* Wiring Actions */
export const setPrimaryWiringCoordinate = createAction<[number, number]>('SET_PRIMARY_WIRING_COORDINATE');

export const attachWire = createAction<[number, number]>('ATTACH_WIRE');

/* Simulation Actions */
export const circuitSimulationStart = createAction('CIRCUIT_SIMULATION_START');
export const circuitSimulationSuccess = createAction('CIRCUIT_SIMULATION_SUCCESS');
export const circuitSimulationError = createAction<{ message: string; }>('CIRCUIT_SIMULATION_ERROR');
export const circuitSimulationReset = createAction('CIRCUIT_SIMULATION_RESET');
