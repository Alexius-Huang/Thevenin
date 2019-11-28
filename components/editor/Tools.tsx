import React, { ReactNode } from 'react';
import { connect, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { ToolsStoreState } from '../../reducers/State';
import { ToolMode } from '../../reducers/State.d';
import { EC } from '../../lib/Electronic';
import * as actions from '../../actions/Tools';
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

  const newElectronicText = mode === ToolMode.ADD_COMPONENT ?
    `<${selectedComponent}>` : 'New Electronics';
  const newElectronicClass = classnames('tool-category', {
    active: mode === ToolMode.ADD_COMPONENT
  });

  return (
    <div className="list-wrapper">
      <ul>
        <li className="tool-category">
          <span>Tools</span>

          <ul className="inner-list">
            <li>
              <button>
                Wiring
              </button>
            </li>
          </ul>
        </li>
        <li className={newElectronicClass}>
          <span>{newElectronicText}</span>

          <ul className="inner-list">
            {
              [EC.DCSource, EC.Ground, EC.Resistor].map(type => (
                <li className={type === selectedComponent ? 'active' : ''}>
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
