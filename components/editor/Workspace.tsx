import React, { RefObject, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import * as Electronic from '../electronics';
// import IdealWire from '../Circuit.IdealWire';

import { useResize } from '../../hooks';
import { WorkspaceProps, Coordinate } from './Workspace.d';
import * as actions from '../../actions/Workspace';
import * as selectors from '../../selectors/Workspace';
import { DestructuredStore } from '../../reducers/State.d';
import './Workspace.scss';

const Workspace: React.FC<WorkspaceProps> = ({
  rows,
  columns,
  unitSize,
  children,
  svgViewBox,
  selectedTool,
  workspaceTranslation,
}) => {
  const dispatch = useDispatch();

  const $svg = React.createRef<SVGSVGElement>();
  const $circuit = React.createRef<SVGRectElement>();
  const $circuitPoints = new Map<string, RefObject<SVGCircleElement>>();

  const [newElectronicCoord, setNewElectronicCoord] = useState<Coordinate | null>(null);

  const handleResize = () => {
    if ($svg.current !== null) {
      const { clientWidth: width, clientHeight: height } = $svg.current;
      dispatch(actions.setSize({ width, height }));
    }
  };

  useResize(handleResize);

  function handleMouseover(e: React.MouseEvent, meta: { [type: string]: any; }) {
    if (selectedTool === null) {
      setNewElectronicCoord(null);
      return;
    }

    const { row, column } = meta;
    setNewElectronicCoord([row, column]);

    /* To get the reference of the circuit point DOM */
    // const refKey = `${row}-${column}`;
    // const circleRef = $circuitPoints.get(refKey);
    // if (circleRef !== undefined && circleRef.current !== null) {
    //   const circle = circleRef.current;
    //   /* anything... */
    // }
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
        onMouseOver={(e) => handleMouseover(e, meta)}
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
      <g className={`grid ${selectedTool !== null ? 'tool-selected' : ''}`}>
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
          (newElectronicCoord !== null) && (
            <Electronic.Resistor
              unitSize={unitSize}
              coordinate={newElectronicCoord}
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
    selectedTool: t.selectedTool,
  };
}

export default connect(mapStateToProps)(Workspace);
