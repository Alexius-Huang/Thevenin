import React from 'react';
import { connect, useDispatch } from 'react-redux';
import CircuitGrid from './Workspace.CircuitGrid';
import * as ElectronicComponent from '../electronics';
import classnames from 'classnames';
// import IdealWire from '../Circuit.IdealWire';

import { WorkspaceProps } from './Workspace.d';
import { EC } from '../../lib/Electronic';
import { ElectronicProps } from '../electronics/types';

import { DestructuredStore, ToolMode } from '../../reducers/State.d';
import * as actions from '../../actions/Workspace';
import * as toolsActions from '../../actions/Tools';
import * as selectors from '../../selectors/Workspace';

import { useResize, useKeyDown } from '../../hooks';
import './Workspace.scss';

const ElectronicComponentMap = new Map<EC, React.FC<ElectronicProps>>([
  [EC.DCSource, ElectronicComponent.DCSource],
  [EC.Ground, ElectronicComponent.Ground],
  [EC.Resistor, ElectronicComponent.Resistor],
]);

const Workspace: React.FC<WorkspaceProps> = ({
  rows,
  columns,
  unitSize,
  svgViewBox,
  mode,
  selectedComponent: SC,
  PC,
  PCIsValid,
  workspaceTranslation,
  circuit,
  children,
}) => {
  const dispatch = useDispatch();
  const $svg = React.createRef<SVGSVGElement>();
  const $circuit = React.createRef<SVGRectElement>();

  useResize(() => {
    if ($svg.current !== null) {
      const { clientWidth: width, clientHeight: height } = $svg.current;
      dispatch(actions.setSize({ width, height }));
    }
  });

  useKeyDown({
    ESC: () => {
      dispatch(toolsActions.cancelAnyOperation());
      dispatch(actions.cancelAnyOperation());
    },
    R: () => {
      if (mode === ToolMode.ADD_COMPONENT && PC !== null) {
        dispatch(actions.rotatePreviewComponent());
        dispatch(actions.validatePreviewComponentAttachability());
      }
    },
  });

  async function handleMouseEnterGridPoint(
    e: React.MouseEvent,
    meta: { row: number; column: number; $circleRef: SVGCircleElement | null },
  ) {
    if (mode === ToolMode.ADD_COMPONENT) {
      const { row, column } = meta;
      dispatch(actions.setPreviewComponent({ type: SC as EC, coordinate: [row, column] }));
      dispatch(actions.validatePreviewComponentAttachability());
    }
  }

  function handleMouseClickGridArea(e: React.MouseEvent) {
    if (mode === ToolMode.ADD_COMPONENT && PC !== null && PCIsValid) {
      dispatch(actions.appendElectronicComponent());
    }
  }

  function handleMouseLeaveGridArea(e: React.MouseEvent) {
    if (mode === ToolMode.ADD_COMPONENT) {
      dispatch(actions.unsetPreviewComponent());
    }
  }

  const workspaceGridClassname = classnames('grid', {
    'add-component-mode': mode === ToolMode.ADD_COMPONENT,
    'wiring-mode': mode === ToolMode.ADD_WIRE,
  });

  const PreviewComponent = SC ? (ElectronicComponentMap.get(SC) as React.FC<ElectronicProps>) : null;

  return <svg
    ref={$svg}
    id="workspace"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox={svgViewBox}
  >
    <g transform={workspaceTranslation}>
      <g
        className={workspaceGridClassname}
        onClick={handleMouseClickGridArea}
        onMouseLeave={handleMouseLeaveGridArea}
      >
        <rect
          ref={$circuit}
          transform={`translate(${[-unitSize / 2, -unitSize / 2]})`}
          className="grid-bg"
          width={(rows + 1) * unitSize}
          height={(columns + 1) * unitSize}
        />

        <CircuitGrid
          handleEnterGridPoint={handleMouseEnterGridPoint}
        />
      </g>

      <g className="circuit">
        {
          (PC !== null && PreviewComponent !== null) && (
            <PreviewComponent
              className={classnames('preview', { invalid: !PCIsValid })}
              electronic={PC}
              unitSize={unitSize}
            />
          )
        }

        {
          Array.from(circuit.electronics.values()).map(e => {
            const Component = ElectronicComponentMap.get(e.name) as React.FC<ElectronicProps>;
            return <Component
              key={e.id}
              unitSize={unitSize}
              electronic={e}
            />;
          })
        }
      </g>

      {children}
    </g>
  </svg>;
}


function mapStateToProps({ Workspace: w, Tools: t }: DestructuredStore) {
  return {
    svgViewBox: selectors.svgViewBoxSelector(w),
    workspaceTranslation: selectors.workspaceTranslationSelector(w),
    rows: w.rows,
    columns: w.columns,
    unitSize: w.unitSize,
    PC: w.previewComponent,
    PCIsValid: w.previewComponentIsValid,
    circuit: w.circuit,

    mode: t.mode,
    selectedComponent: t.selectedComponent,
  };
}

export default connect(mapStateToProps)(Workspace);
