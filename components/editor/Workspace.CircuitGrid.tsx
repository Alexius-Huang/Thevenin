import React, { RefObject, useMemo, Fragment } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ToolMode, WorkspaceStoreState, ToolsStoreState } from '../../reducers/State.d';
import * as actions from '../../actions/Workspace';
import Circuit from '../../lib/Circuit';

type CircuitGridProps = {
  circuit: Circuit,
  mode: ToolMode;
  unitSize: number;
  rows: number;
  columns: number;
  primaryWiringCoordinate: [number, number] | null;
  handleEnterGridPoint: (
    e: React.MouseEvent,
    meta: {
      row: number;
      column: number;
      $circleRef: SVGCircleElement | null;
    },
  ) => void;
};

const CircuitGrid: React.FC<CircuitGridProps> = ({
  circuit,
  mode,
  unitSize,
  rows,
  columns,
  handleEnterGridPoint,
  primaryWiringCoordinate: PWC,
}) => {
  const $circuitPoints = new Map<string, RefObject<SVGCircleElement>>();
  const dispatch = useDispatch();

  function handleGridPointMouseEnter(e: React.MouseEvent, meta: { row: number; column: number; }) {
    const { row, column } = meta;
    const refKey = `${row}-${column}`;
    const circleRef = $circuitPoints.get(refKey);
    let circleEl: SVGCircleElement | null = null;
    if (circleRef !== undefined && circleRef.current !== null) {
      circleEl = circleRef.current;

      handleEnterGridPoint(e, { row, column, $circleRef: circleEl });
    }
  }

  function handleGridPointClick(e: React.MouseEvent, meta: { coordinate: [number, number] }) {
    const { coordinate: c } = meta;
    dispatch(actions.setPrimaryWiringCoordinate(c));
  }

  const gridPinsDirectives = useMemo(() => `
    M${[-unitSize / 4, 0]} L${[unitSize / 4, 0]}
    M${[0, -unitSize / 4]} L${[0, +unitSize / 4]}
  `.trim(), [unitSize]);

  const gridPointRadius = useMemo(() => (
    mode !== ToolMode.NONE ? (unitSize / 2) : 0
  ), [mode, unitSize]);

  const renderGridPoint = (row: number, column: number) => {
    const meta = { row, column };
    const coordinate: [number, number] = [row, column];
    const key = `${row}-${column}`;
    const ref = React.createRef<SVGCircleElement>();
    $circuitPoints.set(key, ref);

    const translation = [(row + .5) * unitSize, (column + .5) * unitSize];

    return (
      <g key={key} className="grid-point-group" transform={`translate(${translation})`}>
        <circle
          className="grid-point" ref={ref} cx="0" cy="0" r={gridPointRadius}
          onMouseEnter={(e) => handleGridPointMouseEnter(e, meta)}
          onClick={(e) => handleGridPointClick(e, { coordinate })}
        />
        <path className="grid-point-pin" d={gridPinsDirectives} />

        {
          (mode === ToolMode.ADD_WIRE && PWC !== null && PWC[0] === row && PWC[1] === column) && (
            <circle className="wiring-coordinate" cx="0" cy="0" r="5" />
          )
        }
      </g>
    );
  };

  const renderGridPoints = Array.from(Array(rows)).map((_, i) =>
    Array.from(Array(columns)).map((_, j) => renderGridPoint(i, j))
  );

  return <Fragment>{renderGridPoints}</Fragment>;
};

function mapStateToProps({ Tools: t, Workspace: w }: { Tools: ToolsStoreState, Workspace: WorkspaceStoreState }) {
  return {
    circuit: w.circuit,
    rows: w.rows,
    columns: w.columns,
    unitSize: w.unitSize,
    primaryWiringCoordinate: w.primaryWiringCoordinate,
    mode: t.mode,
  };
}

export default connect(mapStateToProps)(CircuitGrid);
