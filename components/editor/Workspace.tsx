import React, { RefObject, useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

import * as Electronic from '../electronics';
// import IdealWire from '../Circuit.IdealWire';

import { useResize } from '../../hooks';
import { WorkspaceProps, Coordinate } from './Workspace.d';
import * as actions from '../../actions/Workspace';
import * as selectors from '../../selectors/Workspace';
import { DestructuredStore, ToolMode } from '../../reducers/State.d';
import './Workspace.scss';

const Workspace: React.FC<WorkspaceProps> = ({
  rows,
  columns,
  unitSize,
  svgViewBox,
  toolMode,
  selectedComponent,
  selectedComponentCoordinate,
  workspaceTranslation,
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
      dispatch(actions.setSelectedComponentCoordinate({ coordinate: [row, column] }));  
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
    if (toolMode === ToolMode.ADD_COMPONENT) {
      console.log('Append electronics');
    }
  }

  function handleMouseLeaveGridArea(e: React.MouseEvent) {
    if (toolMode === ToolMode.ADD_COMPONENT) {
      dispatch(actions.unsetSelectedComponentCoordinate());
    }
  }

  const renderGridPoints = Array.from(Array(rows)).map((_, i) =>
    Array.from(Array(columns)).map((_, j) => {
      const meta = { row: i + 1, column: j + 1 };
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
      <g className={`grid ${selectedComponent !== null ? 'tool-selected' : ''}`}>
        <rect
          ref={$circuit}
          transform={`translate(${[-unitSize / 2, -unitSize / 2]})`}
          className="grid-bg"
          width={(rows + 1) * unitSize}
          height={(columns + 1) * unitSize}
          onClick={handleMouseClickGridArea}
          onMouseLeave={handleMouseLeaveGridArea}
        />

        {renderGridPoints}
      </g>

      <g className="circuit">
        {
          (selectedComponentCoordinate !== null) && (
            <Electronic.Resistor
              className="preview"
              unitSize={unitSize}
              coordinate={selectedComponentCoordinate}
            />
          )
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
    selectedComponentCoordinate: selectors.selectedComponentCoordinate(w),

    toolMode: t.mode,
    selectedComponent: t.selectedComponent,
  };
}

export default connect(mapStateToProps)(Workspace);
