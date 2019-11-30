import React, { ReactNode } from 'react';
import { connect, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { ToolsStoreState } from '../../reducers/State';
import { ToolMode } from '../../reducers/State.d';
import { EC } from '../../lib/Electronic';
import * as actions from '../../actions/Tools';
import * as workspaceActions from '../../actions/Workspace';
import './Tools.scss';

type ToolsProps = {
  children: ReactNode;
  selectedComponent: EC | null;
  mode: ToolMode;
};

const Tools: React.FC<ToolsProps> = ({ selectedComponent, mode }) => {
  const dispatch = useDispatch();

  function handleToolSelect(name: EC) {
    if (selectedComponent === name) {
      dispatch(actions.unselectComponent());
    } else {
      dispatch(actions.selectComponent({ name }));
    }
  }

  function handleStartSimulation() {
    dispatch(actions.cancelAnyOperation());
    dispatch(workspaceActions.cancelAnyOperation());
    dispatch(workspaceActions.circuitSimulationStart());
  }

  const basicToolText = mode === ToolMode.ADD_WIRE ?
    '<Wiring>' : 'Basics';
  const basicToolClass = classnames('tool-category', {
    active: mode === ToolMode.ADD_WIRE,
  });

  const newElectronicText = mode === ToolMode.ADD_COMPONENT ?
    `<${selectedComponent}>` : 'New Electronics';
  const newElectronicClass = classnames('tool-category', {
    active: mode === ToolMode.ADD_COMPONENT
  });

  return (
    <div className="tools">
      <ul>
        <li className={basicToolClass}>
          <span>{basicToolText}</span>

          <ul className="inner-list">
            <li className={mode === ToolMode.ADD_WIRE ? 'active' : ''}>
              <button onClick={() => dispatch(actions.enableAddWireMode())}>
                Wiring
              </button>
            </li>

            <li>
              <button onClick={handleStartSimulation}>
                Run Simulation
              </button>
            </li>
          </ul>
        </li>

        <li className={newElectronicClass}>
          <span>{newElectronicText}</span>

          <ul className="inner-list">
            {
              [EC.DCSource, EC.Ground, EC.Resistor].map(type => (
                <li key={type} className={type === selectedComponent ? 'active' : ''}>
                  <button onClick={() => handleToolSelect(type)}>{type}</button>
                </li>
              ))
            }
          </ul>
        </li>
      </ul>
    </div>
  );
};

function mapStateToProps({ Tools: t }: { Tools: ToolsStoreState }) {
  return {
    selectedComponent: t.selectedComponent,
    mode: t.mode,
  };
}

export default connect(mapStateToProps)(Tools);
