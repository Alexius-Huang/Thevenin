import React, { Fragment } from 'react';
import ErrorModal from '../utils/Modal.Error';
import { circuitSimulationReset } from '../../actions/Workspace';
import { WorkspaceStoreState, SimulationStatus } from '../../reducers/State.d';
import { useDispatch, connect } from 'react-redux';

type ModalGroupProps = {
  simulation: {
    status: SimulationStatus;
    errorMessage: string | null;
  };
};

const ModalGroup: React.FC<ModalGroupProps> = ({ simulation }) => {
  const { status, errorMessage } = simulation;
  const dispatch = useDispatch();

  return (
    <Fragment>
      <ErrorModal
        active={SimulationStatus.ERROR === status}
        title="Circuit Simulation Failed 😞"
        message={errorMessage || ''}
        onConfirm={() => dispatch(circuitSimulationReset())}
      />
    </Fragment>
  )
}

function mapStateToProps({ Workspace: w }: { Workspace: WorkspaceStoreState }) {
  return {
    simulation: w.simulation,
  };
}

export default connect(mapStateToProps)(ModalGroup);
