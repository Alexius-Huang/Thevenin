import Electronic from './Electronic';

export class Edge {
  public pinsMap = new Map<string, Node | null>();

  constructor(private electronic: Electronic) {
    this.pins.forEach(pinMeta => {
      this.pinsMap.set(pinMeta, null);
    });
  }

  get id() { return this.electronic.id; }
  get name() { return this.electronic.name; }
  get pins() { return this.electronic.info.pins; }

  public connect(node: Node, pinMeta: string = '') {
    this.pinsMap.set(pinMeta, node);
    node.edges.add({ edge: this, pinMeta });
  }
}

export class Node {
  public edges: Set<{ edge: Edge; pinMeta: string }> = new Set();
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
