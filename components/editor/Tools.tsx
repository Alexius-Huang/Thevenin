import React, { Fragment } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ToolsProps } from './Tools.d';
import { ToolsStoreState } from '../../reducers/State';
import * as actions from '../../actions/Tools';
import './Tools.scss';

const Tools: React.FC<ToolsProps> = ({ selectedTool }) => {
  const dispatch = useDispatch();

  function handleToolSelect(name: string) {
    if (selectedTool === name) {
      dispatch(actions.unselectTool());
    } else {
      dispatch(actions.selectTool({ name }));
    }
  }

  return (
    <Fragment>
      <div className="list-wrapper">
        <h2>Electronics</h2>

        <ul>
          <li className={selectedTool === 'resistor' ? 'active' : ''}>
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
  return { selectedTool: t.selectedTool };
}

export default connect(mapStateToProps)(Tools);
