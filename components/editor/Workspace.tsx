import React, { RefObject, useEffect, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';
import classnames from 'classnames';
import * as ElectronicComponent from '../electronics';
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

  useKeyDown({
    ESC: () => {
      dispatch(toolsActions.cancelAnyOperation());
    },
    R: () => {
      if (toolMode === ToolMode.ADD_COMPONENT) {
        dispatch(actions.rotatePreviewComponent());

        /* TODO: After rotate, check the component attachability again */
      }
    },
  });

  function handleMouseEnterGridPoint(e: React.MouseEvent, meta: { [type: string]: any; }) {
    if (toolMode === ToolMode.ADD_COMPONENT) {
      const { row, column } = meta;
      const { rotations } = PC;
      const coordinate = [row, column] as Coordinate;
      const electronic = createElectronic(SC as EC, { coordinate });
      for (let i = 0; i < rotations; i++)
        electronic.rotate();

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
    const { coordinate, isValid, rotations } = PC;

    if (
      toolMode === ToolMode.ADD_COMPONENT &&
      isValid &&
      coordinate !== null
    ) {
      const electronic = createElectronic(SC as EC, { coordinate });
      for (let i = 0; i < rotations; i += 1) electronic.rotate();

      dispatch(actions.appendElectronicComponent(electronic));
    }
  }

  function handleMouseLeaveGridArea(e: React.MouseEvent) {
    if (toolMode === ToolMode.ADD_COMPONENT) {
      dispatch(actions.unsetPreviewComponentInfo());
    }
  }

  const gridPinsDirectives = useMemo(() => {
    return `M${[-unitSize / 4, 0]} L${[unitSize / 4, 0]} M${[0, -unitSize / 4]} L${[0, +unitSize / 4]}`;
  }, [unitSize]);

  const gridPointRadius = useMemo(() => {
    return toolMode !== ToolMode.NONE ? (unitSize / 2) : 0;
  }, [toolMode, unitSize]);

  const renderGridPoints = Array.from(Array(rows)).map((_, i) =>
    Array.from(Array(columns)).map((_, j) => {
      const meta = { row: i, column: j };
      const key = `${meta.row}-${meta.column}`;
      const ref = React.createRef<SVGCircleElement>();
      $circuitPoints.set(key, ref);

      const translation = [(i + .5) * unitSize, (j + .5) * unitSize];

      return <g key={key} className="grid-point-group" transform={`translate(${translation})`}>
        <circle
          className="grid-point" ref={ref} cx="0" cy="0" r={gridPointRadius}
          onMouseEnter={(e) => handleMouseEnterGridPoint(e, meta)}
        />
        <path className="grid-point-pin" d={gridPinsDirectives} />
      </g>;
    })
  );

  const workspaceGridClassname = classnames('grid', {
    'add-component-mode': toolMode === ToolMode.ADD_COMPONENT,
    'wiring-mode': toolMode === ToolMode.ADD_WIRE,
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

        {renderGridPoints}
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

    toolMode: t.mode,
    selectedComponent: t.selectedComponent,
  };
}

export default connect(mapStateToProps)(Workspace);
