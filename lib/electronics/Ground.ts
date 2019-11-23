import { Edge, Node } from "../Circuit.Graph";

function deriveCurrent(
  edge: Edge,
): boolean {
  const node = edge.nodesMap.get('') as Node;
  edge.current = 0;
  node.voltage = 0;
  return true;
}

export const Ground = {
  deriveCurrent,
};
