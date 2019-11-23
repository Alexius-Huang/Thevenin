import Electronic, { EC } from './Electronic';

export type EdgeID = string;

export class Edge {
  public pinsMap = new Map<string, Node | null>();
  public id: EdgeID;

  constructor(private _electronic: Electronic) {
    this.id = _electronic.id;

    this.pins.forEach(pinName => {
      this.pinsMap.set(pinName, null);
    });
  }

  get electronic(): Electronic { return this._electronic; }
  get name() { return this.electronic.name; }
  get pins() { return this.electronic.info.pins; }

  public connect(node: Node, pinName: string = '', bias: number = 0) {
    this.pinsMap.set(pinName, node);
    node.info.add({ edgeID: this.id, pinName, bias });
  }
}

export type NodeInfo = {
  edgeID: EdgeID;
  pinName: string;
  bias: number;
}

export class Node {
  public info = new Set<NodeInfo>();

  public boostVoltageBias(bias: number) {
    this.info.forEach(info => {
      info.bias += bias;
    });
  }
}

export default class Graph {
  static Edge = Edge;
  static Node = Node;

  public nodes = new Set<Node>([]);
  public edges = new Map<EdgeID, Edge>();

  public findEdge(id: EdgeID): Edge {
    if (this.edges.has(id))
      return this.edges.get(id) as Edge;
    throw new Error('Edge is not found!');
  }

  public createEdge(electronic: Electronic) {
    const edge = new Graph.Edge(electronic);
    this.edges.set(edge.id, edge);
    return edge;
  }

  public createNode() {
    const node = new Graph.Node();
    this.nodes.add(node);
    return node;
  }
};
