import React, { RefObject } from 'react';
import { connect, useDispatch } from 'react-redux';
import classnames from 'classnames';

import * as Electronic from '../electronics';
// import IdealWire from '../Circuit.IdealWire';

import { useResize } from '../../hooks';
import { WorkspaceProps, Coordinate } from './Workspace.d';
import * as actions from '../../actions/Workspace';
import * as selectors from '../../selectors/Workspace';
import { DestructuredStore, ToolMode } from '../../reducers/State.d';
import './Workspace.scss';
import { createElectronic, EC } from '../../lib/Electronic';

const Workspace: React.FC<WorkspaceProps> = ({
  rows,
  columns,
  unitSize,
  svgViewBox,
  toolMode,
  selectedComponent: SC,
  previewComponent: PC,
  workspaceTranslation,
  circuit,
  children,
}) => {
  const dispatch = useDispatch();

  const $svg = React.createRef<SVGSVGElement>();
  const $circuit = React.createRef<SVGRectElement>();
  const $circuitPoints = new Map<string, RefObject<SVGCircleElement>>();

  useResize(() => {
    if ($svg.current !== null) {
      const { clientWidth: width, clientHeight: height } = $svg.current;
      dispatch(actions.setSize({ width, height }));
    }
  });

  function handleMouseEnterGridPoint(e: React.MouseEvent, meta: { [type: string]: any; }) {
    if (toolMode === ToolMode.ADD_COMPONENT) {
      const { row, column } = meta;
      const coordinate = [row, column] as Coordinate;
      const electronic = createElectronic(EC.Resistor, { coordinate });
      const isValid = circuit.canAttachComponent(electronic);

      dispatch(actions.setPreviewComponentInfo({ coordinate, isValid }));
    }

    /* To get the reference of the circuit point DOM */
    // const refKey = `${row}-${column}`;
    // const circleRef = $circuitPoints.get(refKey);
    // if (circleRef !== undefined && circleRef.current !== null) {
    //   const circle = circleRef.current;
    //   /* anything... */
    // }
  }

  function handleMouseClickGridArea(e: React.MouseEvent) {
    const { coordinate, isValid } = PC;

    if (
      toolMode === ToolMode.ADD_COMPONENT &&
      isValid &&
      coordinate !== null
    ) {
      const electronic = createElectronic(EC.Resistor, { coordinate });
      dispatch(actions.appendElectronicComponent(electronic));
    }
  }

  function handleMouseLeaveGridArea(e: React.MouseEvent) {
    if (toolMode === ToolMode.ADD_COMPONENT) {
      dispatch(actions.unsetPreviewComponentInfo());
    }
  }

  const renderGridPoints = Array.from(Array(rows)).map((_, i) =>
    Array.from(Array(columns)).map((_, j) => {
      const meta = { row: i, column: j };
      const key = `${meta.row}-${meta.column}`;
      const ref = React.createRef<SVGCircleElement>();
      $circuitPoints.set(key, ref);

      return <circle
        className="grid-point"
        key={key}
        ref={ref}
        cx={(i + .5) * unitSize}
        cy={(j + .5) * unitSize}
        onMouseEnter={(e) => handleMouseEnterGridPoint(e, meta)}
      />;
    })
  );

  const workspaceGridClassname = classnames('grid', {
    'tool-selected': SC !== null
  });

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

        {renderGridPoints}
      </g>

      <g className="circuit">
        {
          (PC.coordinate !== null) && (
            <Electronic.Resistor
              className={classnames('preview', {
                invalid: !PC.isValid,
              })}
              unitSize={unitSize}
              coordinate={PC.coordinate}
            />
          )
        }

        {
          circuit.electronics.map(e => {
            return <Electronic.Resistor
              key={e.id}
              unitSize={unitSize}
              coordinate={e.coordinate}
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

    toolMode: t.mode,
    selectedComponent: t.selectedComponent,
  };
}

export default connect(mapStateToProps)(Workspace);
