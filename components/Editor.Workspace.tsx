import React from 'react';
import { connect } from 'react-redux';
import { WorkspaceProps, WorkspaceState, Coordinate } from './Editor.Workspace.d';
import IdealWire from './Circuit.IdealWire';
import * as actions from '../actions/Workspace';
import State from '../reducers/State';
import './Editor.Workspace.scss';

class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {
  public state: WorkspaceState = {};
  private svgRef: SVGSVGElement | null = null;

  static async getInitialProps() {
    return {};
  }

  private get svgViewBox() {
    const { width, height } = this.props;
    return `0 0 ${width} ${height}`;
  }

  private get workspaceTranslation() {
    const { width, height, unitSize, rows, columns } = this.props;

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
      this.props.dispatch(actions.setSize({ width, height }));
    }
  }

  render() {
    const { rows, columns, unitSize } = this.props;

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

          {renderGridPoints}
        </g>


        <g className="circuit">
          <IdealWire
            terminals={[[1, 1], [1, 5]]}
          />
        </g>
        {this.props.children}
      </g>
    </svg>;
  }
};

function mapStateToProps({ Workspace: w }: { Workspace: State }) {
  return w;
}

export default connect(mapStateToProps)(Workspace);
