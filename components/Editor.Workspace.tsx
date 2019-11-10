import React, { ReactNode } from 'react';
import IdealWire from './Circuit.IdealWire';
import './Editor.Workspace.scss';

type Coordinate = [number, number];
type WorkspaceProps = { children: ReactNode };
type WorkspaceState = {
  svg: {
    width: number;
    height: number;
  };
  workspace: {
    unitSize: number;
    rows: number;
    columns: number;
  };
};

class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {
  public state: WorkspaceState = {
    svg: {
      width: 0,
      height: 0,
    },
    workspace: {
      unitSize: 25,
      rows: 10,
      columns: 10,
    },
  };
  private svgRef: SVGSVGElement | null = null;

  static async getInitialProps() {
    return {};
  }

  private get svgViewBox() {
    const { width, height } = this.state.svg;
    return `0 0 ${width} ${height}`;
  }

  private get workspaceTranslation() {
    const { width, height } = this.state.svg;
    const { unitSize, rows, columns } = this.state.workspace;

    const coord: Coordinate = [
      (width - (rows * unitSize)) / 2,
      (height - (columns * unitSize)) / 2,
    ];
    return `translate(${coord})`;
  }

  public componentDidMount() {
    if (process.browser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  public componentWillUnmount() {
    if (process.browser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  private handleResize = () => {
    if (this.svgRef !== null) {
      const { clientWidth: width, clientHeight: height } = this.svgRef;
      this.setState(state => ({ ...state, svg: { ...state.svg, width, height } }));
    }
  }

  render() {
    const { rows, columns, unitSize } = this.state.workspace;

    return <svg
      ref={(c) => { this.svgRef = c; }}
      id="workspace"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={this.svgViewBox}
    >
      <g transform={this.workspaceTranslation}>
        <g className="grid">
          <rect
            transform={`translate(${[-unitSize / 2, -unitSize / 2]})`}
            className="grid-bg"
            width={(rows + 1) * unitSize}
            height={(columns + 1) * unitSize}
          />

          {
            Array.from(Array(rows)).map((_, i) =>
              Array.from(Array(columns)).map((_, j) =>
                <circle className="grid-point" key={`${i}-${j}`} cx={(i + .5) * unitSize} cy={(j + .5) * unitSize} />
              )
            )
          }
        </g>


        <g className="circuit">
          <IdealWire
            terminals={[[1, 1], [1, 5]]}
            unitSize={unitSize}
          />
        </g>
        {this.props.children}
      </g>
    </svg>;
  }
};

export default Workspace;
