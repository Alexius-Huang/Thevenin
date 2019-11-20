import Electronic, { EC } from './Electronic';

export class Edge {
  public pinsMap = new Map<string, Node | null>();

  constructor(public electronic: Electronic) {
    this.pins.forEach(pinMeta => {
      this.pinsMap.set(pinMeta, null);
    });
  }

  get id() { return this.electronic.id; }
  get name() { return this.electronic.name; }
  get pins() { return this.electronic.info.pins; }

  public connect(node: Node, pinMeta: string = '', bias: number = 0) {
    this.pinsMap.set(pinMeta, node);
    node.info.add({ edge: this, pinMeta, bias });
  }
}

export type NodeInfo = {
  edge: Edge;
  pinMeta: string;
  bias: number;
}

export class Node {
  public info = new Set<NodeInfo>();
}

export default class Graph {
  static Edge = Edge;
  static Node = Node;

  public nodes: Array<Node> = [];
  public edges: Array<Edge> = [];

  public createEdge(electronic: Electronic) {
    const edge = new Graph.Edge(electronic);
    this.edges.push(edge);
    return edge;
  }

  public createNode() {
    const node = new Graph.Node();
    this.nodes.push(node);
    return node;
  }
};
