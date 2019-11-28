import React, { RefObject } from 'react';
import { connect, useDispatch } from 'react-redux';
import CircuitGrid from './Workspace.CircuitGrid';
import * as ElectronicComponent from '../electronics';
import classnames from 'classnames';
// import IdealWire from '../Circuit.IdealWire';

import { WorkspaceProps, Coordinate } from './Workspace.d';
import { createElectronic, EC } from '../../lib/Electronic';
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
  previewComponent: PC,
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
    },
    R: () => {
      if (mode === ToolMode.ADD_COMPONENT) {
        dispatch(actions.rotatePreviewComponent());

        /* TODO: After rotate, check the component attachability again */
      }
    },
  });

  function handleMouseEnterGridPoint(
    e: React.MouseEvent,
    meta: { row: number; column: number; $circleRef: SVGCircleElement | null },
  ) {
    if (mode === ToolMode.ADD_COMPONENT) {
      const { row, column } = meta;
      const { rotations } = PC;
      const coordinate = [row, column] as Coordinate;
      const electronic = createElectronic(SC as EC, { coordinate });
      for (let i = 0; i < rotations; i++)
        electronic.rotate();

      const isValid = circuit.canAttachComponent(electronic);
      dispatch(actions.setPreviewComponentInfo({ coordinate, isValid }));
    }
  }

  function handleMouseClickGridArea(e: React.MouseEvent) {
    const { coordinate, isValid, rotations } = PC;

    if (
      mode === ToolMode.ADD_COMPONENT &&
      isValid &&
      coordinate !== null
    ) {
      const electronic = createElectronic(SC as EC, { coordinate });
      for (let i = 0; i < rotations; i += 1) electronic.rotate();

      dispatch(actions.appendElectronicComponent(electronic));
    }
  }

  function handleMouseLeaveGridArea(e: React.MouseEvent) {
    if (mode === ToolMode.ADD_COMPONENT) {
      dispatch(actions.unsetPreviewComponentInfo());
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
          (PC.coordinate !== null && PreviewComponent !== null) && (
            <PreviewComponent
              className={classnames('preview', {
                invalid: !PC.isValid,
              })}
              unitSize={unitSize}
              coordinate={PC.coordinate}
              rotations={PC.rotations}
            />
          )
        }

        {
          Array.from(circuit.electronics.values()).map(e => {
            const Component = ElectronicComponentMap.get(e.name) as React.FC<ElectronicProps>;
            return <Component
              key={e.id}
              unitSize={unitSize}
              coordinate={e.coordinate}
              rotations={e.rotations}
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
    previewComponent: w.previewComponent,
    circuit: w.circuit,

    mode: t.mode,
    selectedComponent: t.selectedComponent,
  };
}

export default connect(mapStateToProps)(Workspace);
