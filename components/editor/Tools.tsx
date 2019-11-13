import React, { Fragment } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ToolsProps } from './Tools.d';
import { ToolsStoreState } from '../../reducers/State';
import * as actions from '../../actions/Tools';
import './Tools.scss';

const Tools: React.FC<ToolsProps> = ({ selectedComponent }) => {
  const dispatch = useDispatch();

  function handleToolSelect(name: string) {
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
          <li className={selectedComponent === 'resistor' ? 'active' : ''}>
            <button onClick={() => handleToolSelect('resistor')}>
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
