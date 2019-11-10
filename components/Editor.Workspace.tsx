import React, { ReactNode, Fragment, useState, useEffect, useRef } from 'react';

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
    center: Coordinate;
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
      center: [5, 5],
    },
  };
  private svgRef: SVGSVGElement | null = null;

  // constructor(props: WorkspaceProps) {
  //   super(props);
  // }

  static async getInitialProps() {
    return {};
  }

  private get svgViewBox() {
    const { width, height } = this.state.svg;
    return `0 0 ${width} ${height}`;
  }

  private get workspaceTranslation() {
    const { width, height } = this.state.svg;
    const { unitSize, rows, columns, center } = this.state.workspace;

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

    return (
      <Fragment>
        <svg
          ref={(c) => { this.svgRef = c; }}
          id="workspace"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox={this.svgViewBox}
        >
          <g className="grid" transform={this.workspaceTranslation}>
            <rect
              transform={`translate(${[-unitSize / 2, -unitSize / 2]})`}
              className="grid-bg"
              width={(rows + 1) * unitSize}
              height={(columns + 1) * unitSize}
            />

            {
              Array.from(Array(rows)).map((_, i) =>
                Array.from(Array(columns)).map((_, j) =>
                  <circle cx={(i + .5) * unitSize} cy={(j + .5) * unitSize} r="1" fill="rgba(0, 0, 0, 0.3)" />
                )
              )
            }
          </g>
          {this.props.children}
        </svg>
  
        <style jsx>{`
          svg#workspace {
            display: inline-block;
            background-color: #aaa;
          }

          svg#workspace > g.grid > rect.grid-bg {
            fill: white;
            stroke: #333;
            stroke-width: 1;
          }
        `}</style>
      </Fragment>
    );
  }
};

export default Workspace;
