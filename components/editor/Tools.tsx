import React, { Fragment } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ToolsProps } from './Tools.d';
import { ToolsStoreState } from '../../reducers/State';
import * as actions from '../../actions/Tools';
import './Tools.scss';
import { EC } from '../../lib/Electronic';

const Tools: React.FC<ToolsProps> = ({ selectedComponent }) => {
  const dispatch = useDispatch();

  function handleToolSelect(name: EC) {
    if (selectedComponent === name) {
      dispatch(actions.unselectComponent());
    } else {
      dispatch(actions.selectComponent({ name }));
    }
  }

  return (
    <Fragment>
      <div className="list-wrapper">
        <h2>Electronics</h2>

        <ul>
          <li className={selectedComponent !== null ? 'active' : ''}>
            <button onClick={() => handleToolSelect(EC.Resistor)}>
              <img src={'/static/circuit/resistor.svg'} alt="Resistor" style={{ backgroundColor: 'transparent' }}/>
              <span>Resistor</span>
            </button>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

function mapStateToProps({ Tools: t }: { Tools: ToolsStoreState }) {
  return { selectedComponent: t.selectedComponent };
}

export default connect(mapStateToProps)(Tools);
