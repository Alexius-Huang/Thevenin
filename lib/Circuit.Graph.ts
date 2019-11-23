import Electronic, { EC } from './Electronic';
import { PinName } from './Electronic.Info';

export type EdgeID = string;
export enum CurrentFlow {
  INWARD = 'Inward',
  OUTWARD = 'Outward',
  NEUTRAL = 'Neutral',
};

export class Edge {
  public pinsMap = new Map<string, Node | null>();
  public id: EdgeID;
  public current: number = NaN;

  constructor(private _electronic: Electronic) {
    this.id = _electronic.id;

    this.pins.forEach(pinName => {
      this.pinsMap.set(pinName, null);
    });
  }

  get electronic(): Electronic { return this._electronic; }
  get name() { return this.electronic.name; }
  get pins() { return this.electronic.info.pins; }

  public connect(
    node: Node,
    pinName: string = '',
    bias: number = 0,
    currentFlow: CurrentFlow = CurrentFlow.NEUTRAL,
  ) {
    this.pinsMap.set(pinName, node);
    const pinInfo = { edgeID: this.id, pinName, bias, currentFlow };
    node.info.add(pinInfo);

    if (node.edgeMap.has(this.id)) {
      const pinInfoMap = node.edgeMap.get(this.id) as Map<string, PinInfo>;
      pinInfoMap.set(pinName, pinInfo);
    } else {
      node.edgeMap.set(this.id, new Map([[pinName, pinInfo]]));
    }
  }
}

export type PinInfo = {
  edgeID: EdgeID;
  pinName: PinName;
  bias: number;
  currentFlow: CurrentFlow;
}

export type PinInfoMap = Map<PinName, PinInfo>;

export class Node {
  public info = new Set<PinInfo>();
  public edgeMap = new Map<EdgeID, PinInfoMap>();
  public voltage: number = NaN;
  public isSupernode = false;

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
