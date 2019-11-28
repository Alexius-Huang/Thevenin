import React, { RefObject, useMemo, Fragment } from 'react';
import { connect } from 'react-redux';
import { ToolMode, WorkspaceStoreState, ToolsStoreState } from '../../reducers/State.d';

type CircuitGridProps = {
  mode: ToolMode;
  unitSize: number;
  rows: number;
  columns: number;
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
  mode,
  unitSize,
  rows,
  columns,
  handleEnterGridPoint,
}) => {
  const $circuitPoints = new Map<string, RefObject<SVGCircleElement>>();

  function handleMouseEnterGridPoint(e: React.MouseEvent, meta: { row: number; column: number; }) {
    /* To get the reference of the circuit point DOM */
    const { row, column } = meta;
    const refKey = `${row}-${column}`;
    const circleRef = $circuitPoints.get(refKey);
    let circleEl: SVGCircleElement | null = null;
    if (circleRef !== undefined && circleRef.current !== null) {
      circleEl = circleRef.current;

      handleEnterGridPoint(e, { row, column, $circleRef: circleEl });
    }
  }

  const gridPinsDirectives = useMemo(() => `
    M${[-unitSize / 4, 0]} L${[unitSize / 4, 0]}
    M${[0, -unitSize / 4]} L${[0, +unitSize / 4]}
  `.trim(), [unitSize]);

  const gridPointRadius = useMemo(() => (
    mode !== ToolMode.NONE ? (unitSize / 2) : 0
  ), [mode, unitSize]);

  const renderGridPoints = Array.from(Array(rows)).map((_, i) =>
    Array.from(Array(columns)).map((_, j) => {
      const meta = { row: i, column: j };
      const key = `${meta.row}-${meta.column}`;
      const ref = React.createRef<SVGCircleElement>();
      $circuitPoints.set(key, ref);

      const translation = [(i + .5) * unitSize, (j + .5) * unitSize];

      return (
        <g key={key} className="grid-point-group" transform={`translate(${translation})`}>
          <circle
            className="grid-point" ref={ref} cx="0" cy="0" r={gridPointRadius}
            onMouseEnter={(e) => handleMouseEnterGridPoint(e, meta)}
          />
          <path className="grid-point-pin" d={gridPinsDirectives} />
        </g>
      );
    })
  );

  return <Fragment>{renderGridPoints}</Fragment>;
};

function mapStateToProps({ Tools: t, Workspace: w }: { Tools: ToolsStoreState, Workspace: WorkspaceStoreState }) {
  return {
    rows: w.rows,
    columns: w.columns,
    unitSize: w.unitSize,
    mode: t.mode,
  };
}

export default connect(mapStateToProps)(CircuitGrid);
