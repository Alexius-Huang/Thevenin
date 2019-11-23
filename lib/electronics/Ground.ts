import { Edge, Node } from "../Circuit.Graph";

function deriveCurrent(
  edge: Edge,
  node: { '': Node }
) {
  edge.current = 0;
  node[''].voltage = 0;
}

export const Ground = {
  deriveCurrent,
};
