import React from 'react';
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
        <li className="tool-category">
          <span>New Electronics</span>

          <ul className="inner-list">
            <li>
              <button>
                DC Source
              </button>
            </li>
            <li>
              <button>
                Ground
              </button>
            </li>
            <li>
              <button onClick={() => handleToolSelect(EC.Resistor)}>
                Resistor
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

function mapStateToProps({ Tools: t }: { Tools: ToolsStoreState }) {
  return { selectedComponent: t.selectedComponent };
}

export default connect(mapStateToProps)(Tools);
