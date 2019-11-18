import { IElectronic } from './Electronic';

export class Node {
  public pinsMap = new Map<string, Edge | null>();

  constructor(private electronic: IElectronic) {
    this.pins.forEach(pinMeta => {
      this.pinsMap.set(pinMeta, null);
    });
  }

  get id() { return this.electronic.id; }
  get name() { return this.electronic.name; }
  get pins() { return this.electronic.info.pins; }

  public connect(edge: Edge, pinMeta: string = '') {
    this.pinsMap.set(pinMeta, edge);
    edge.nodes.add({ node: this, pinMeta });
  }
}

export class Edge {
  public nodes: Set<{ node: Node; pinMeta: string }> = new Set();
}

export default class Graph {
  static Edge = Edge;
  static Node = Node;

  public nodes: Array<Node> = [];
  public edges: Array<Edge> = [];

  public createNode(electronic: IElectronic) {
    const node = new Graph.Node(electronic);
    this.nodes.push(node);
    return node;
  }

  public createEdge() {
    const edge = new Graph.Edge();
    this.edges.push(edge);
    return edge;
  }
};
