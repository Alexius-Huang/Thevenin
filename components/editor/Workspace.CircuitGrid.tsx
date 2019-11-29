import React, { RefObject, useMemo, Fragment } from 'react';
import { connect, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { ToolMode, WorkspaceStoreState, ToolsStoreState } from '../../reducers/State.d';
import * as actions from '../../actions/Workspace';
import Circuit from '../../lib/Circuit';
import { CurrentFlow } from '../../lib/Circuit.Graph';

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

  function handleGridPointClick(
    e: React.MouseEvent,
    coordinate: [number, number]
  ) {
    const [row, column] = coordinate;

    if (mode === ToolMode.ADD_WIRE) {  
      if (PWC !== null && (
        (PWC[0] === row && (PWC[1] === column - 1 || PWC[1] === column + 1)) ||
        (PWC[1] === column && (PWC[0] === row - 1 || PWC[0] === row + 1))
      )) {
        if (circuit.canAddJoint(PWC, coordinate)) {
          dispatch(actions.attachWire(coordinate));
        } else {
          /* TODO: Show cannot attach wire hint! */
        }
      } else {
        dispatch(actions.setPrimaryWiringCoordinate(coordinate));
      }
    }
  }

  const gridPinsDirectives = useMemo(() => `
    M${[-unitSize / 4, 0]} L${[unitSize / 4, 0]}
    M${[0, -unitSize / 4]} L${[0, +unitSize / 4]}
  `.trim(), [unitSize]);

  const gridPointRadius = useMemo(() => (
    mode !== ToolMode.NONE ? (unitSize / 2) : 0
  ), [mode, unitSize]);

  const wireLengthFromUnit = (unitSize / 2);
  const renderGridPoint = (row: number, column: number) => {
    const meta = { row, column };
    const coordinate: [number, number] = [row, column];
    const key = `${row}-${column}`;
    const ref = React.createRef<SVGCircleElement>();
    $circuitPoints.set(key, ref);

    const translation = [(row + .5) * unitSize, (column + .5) * unitSize];
    const gridPointPinClasses = ['grid-point-pin'];

    if (mode === ToolMode.ADD_WIRE && PWC !== null && (
      (PWC[0] === row && (PWC[1] === column - 1 || PWC[1] === column + 1)) ||
      (PWC[1] === column && (PWC[0] === row - 1 || PWC[0] === row + 1))
    )) {
      const wireAttachmentClass = circuit.canAddJoint(PWC, [row, column]) ?
        'wire-attachable' : 'wire-unattachable';
      gridPointPinClasses.push(wireAttachmentClass);
    }

    const unit = circuit.layout[column][row];
    const cuConns = unit.circuitUnitConnections;
    const directions = new Set(cuConns.map(conn => conn.direction));
    if (directions.size !== 0)console.log(cuConns);

    return (
      <g key={key} className="grid-point-group" transform={`translate(${translation})`}>
        <circle
          className="grid-point" ref={ref} cx="0" cy="0" r={gridPointRadius}
          onMouseEnter={(e) => handleGridPointMouseEnter(e, meta)}
          onClick={(e) => handleGridPointClick(e, coordinate)}
        />
        <path className={classnames(gridPointPinClasses)} d={gridPinsDirectives} />

        {
          cuConns.map(({ direction, connection: conn }) => {
            const directive =
              direction === 'left'   ? `M0 0 L-${wireLengthFromUnit} 0` :
              direction === 'right'  ? `M0 0 L${wireLengthFromUnit} 0`  :
              direction === 'top'    ? `M0 0 L0 -${wireLengthFromUnit}` :
              `M0 0 L0 ${wireLengthFromUnit}`;

            return [
              <path key={`${key}-${direction}-1`} className="wire-path" d={directive} />,
              !Number.isNaN(conn.current) && conn.current !== 0 ? <path
                key={`${key}-${direction}-2`}
                className={classnames('wire-path', 'has-current', {
                  'inward-current': conn.currentFlow === CurrentFlow.INWARD,
                  'outward-current': conn.currentFlow === CurrentFlow.OUTWARD,
                })}
                d={directive}
              /> : undefined,
            ];
          })
        }

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
