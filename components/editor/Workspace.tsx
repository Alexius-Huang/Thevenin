import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { WorkspaceProps, Coordinate } from './Workspace.d';
// import IdealWire from '../Circuit.IdealWire';
import { useResize } from '../../hooks';
import * as actions from '../../actions/Workspace';
import { WorkspaceStoreState, ToolsStoreState } from '../../reducers/State.d';
import './Workspace.scss';

const Workspace: React.FC<WorkspaceProps> = ({
  width,
  height,
  rows,
  columns,
  unitSize,
  children,
}) => {
  const dispatch = useDispatch();

  const $svg = React.createRef<SVGSVGElement>();
  const $circuit = React.createRef<SVGRectElement>();

  const svgViewBox = `0 0 ${width} ${height}`;

  const coord: Coordinate = [
    (width - (rows * unitSize)) / 2,
    (height - (columns * unitSize)) / 2,
  ];
  const workspaceTranslation = `translate(${coord})`;

  const handleResize = () => {
    if ($svg.current !== null) {
      const { clientWidth: width, clientHeight: height } = $svg.current;
      dispatch(actions.setSize({ width, height }));
    }
  };

  useResize(handleResize);

  // private handleMousemove = (e: React.MouseEvent) => {
  //   console.log(e.target);
  // }

  const renderGridPoints = Array.from(Array(rows)).map((_, i) =>
    Array.from(Array(columns)).map((_, j) =>
      <circle
        className="grid-point"
        key={`${i}-${j}`}
        cx={(i + .5) * unitSize}
        cy={(j + .5) * unitSize}
      />
    )
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
      <g className="grid">
        <rect
          ref={$circuit}
          // onMouseMove={handleMousemove}
          transform={`translate(${[-unitSize / 2, -unitSize / 2]})`}
          className="grid-bg"
          width={(rows + 1) * unitSize}
          height={(columns + 1) * unitSize}
        />

        {renderGridPoints}
      </g>


      <g className="circuit">
      </g>

      {children}
    </g>
  </svg>;
}

type DestructuredStore = {
  Tools: ToolsStoreState,
  Workspace: WorkspaceStoreState,
};

function mapStateToProps({ Tools: t, Workspace: w }: DestructuredStore) {
  return w;
}

export default connect(mapStateToProps)(Workspace);
