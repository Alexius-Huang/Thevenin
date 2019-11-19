import { IElectronic, Coordinate } from './Electronic';
import Unit, { CircuitUnitType, CircuitConnection } from './Circuit.Unit';
import ElectronicUnit, { ElectronicUnitType } from './Electronic.Unit';
import Graph, { Node, Edge } from './Circuit.Graph';
import CircuitUnit from './Circuit.Unit';

export default class Circuit {
  static Graph = Graph;
  public electronics = new Map<string, IElectronic>();
  public layout: Array<Array<Unit>>;

  constructor(public columns: number, public rows: number) {
    this.layout = Array.from(Array(rows)).map(() =>
      Array.from(Array(columns)).map(() => new Unit())
    );
  }

  public addJoint(c1: Coordinate, c2: Coordinate) {
    let [[col1, row1], [col2, row2]] = [c1, c2];
    const [deltaCol, deltaRow] = [col2 - col1, row2 - row1];
    const [cu1, cu2] = [
      this.layout[row1][col1],
      this.layout[row2][col2],
    ];

    if (Math.abs(deltaCol) === 1 && deltaRow === 0) {
      if (deltaCol > 0) {
        cu1.connect('right', cu2);
        // cu2.connect('left', cu1);
      } else {
        cu1.connect('left', cu2);
        // cu2.connect('right', cu1);
      }
    } else if (Math.abs(deltaRow) === 1 && deltaCol === 0) {
      if (deltaRow > 0) {
        cu1.connect('bottom', cu2);
        // cu2.connect('top', cu1);
      } else {
        cu1.connect('top', cu2);
        // cu2.connect('bottom', cu1);
      }
    } else {
      throw new Error('Invalid circuit joint connection!');
    }
  }

  public appendElectronics(e: IElectronic) {
    this.mapElectronicUnitWithCircuitUnit(e, (eu, cu) => {
      if (eu.type === ElectronicUnitType.Pin) {
        cu.connect(eu.circuitConnectDirection, { electronic: e, pinName: eu.meta });
      } else if (eu.type === ElectronicUnitType.Occupied) {
        cu.setElectronic(e.id);
      } else {
        throw new Error(`Electronic Unit type ${ElectronicUnitType[eu.type]} isn't declared`);
      }
    });

    this.electronics.set(e.id, e);
  }

  public canAttachComponent(e: IElectronic): boolean {
    try {
      this.mapElectronicUnitWithCircuitUnit(e, (eu, cu, [relX, relY]) => {
        const isOutOfBound = (relX < 0 || relY < 0 || relX >= this.columns || relY >= this.rows);
        if (isOutOfBound) throw 'Break-loop';
  
        if (
          cu.type === CircuitUnitType.Electronic ||
          cu.type === CircuitUnitType.Occupied ||
  
          // Circuit unit isn't available but perhaps partially available
          cu.type !== CircuitUnitType.Available && (
            // Electronic unit should occupy then cannot accept non-available circuit unit
            eu.type === ElectronicUnitType.Occupied ||
  
            // Electronic unit is pin since is isn't occupied
            // but isn't connectable to the circuit
            !cu.isDirectionConnectable(eu.circuitConnectDirection)
          )
        ) throw 'Break-loop';
      });
    } catch (err) { return false; }
    return true;
  }

  public deriveGraph() {
    const graph = new Circuit.Graph();

    const traversedCircuitUnit = new Set<CircuitUnit>();
    const electronicNodeMap = new Map<string, Node>();

    let traverseFromElectronic = (e: IElectronic) => {
      this.mapElectronicUnitWithCircuitUnit(e, (eu, cu) => {
        const { connectDirection: connectDir } = eu;

        // Check if it is pin and if the pin is already traversed or not
        if (connectDir !== null && !traversedCircuitUnit.has(cu)) {
          traverseFromCircuitUnit(cu);
        }
      });
    }

    let traverseFromCircuitUnit = (cu: CircuitUnit, linkedEdge?: Edge) => {
      traversedCircuitUnit.add(cu);
      const edge = linkedEdge || graph.createEdge();
      const spannedUnit: Array<CircuitConnection> = [cu.top, cu.right, cu.bottom, cu.left];

      spannedUnit.forEach(unit => {
        if (unit === null) return;

        if (unit instanceof CircuitUnit) {
          if (!traversedCircuitUnit.has(unit)) {
            traverseFromCircuitUnit(unit, edge);
          }
        } else {
          const node = electronicNodeMap.get(unit.electronic.id) as Node;
          node.connect(edge, unit.pinName);
        }
      });
    }

    const electronicsIter = this.electronics.values();
    const electronics: Array<IElectronic> = [];
    let pulled = electronicsIter.next();

    while (!pulled.done) {
      const electronic = pulled.value;
      const node = graph.createNode(electronic);
      electronicNodeMap.set(electronic.id, node);
      electronics.push(electronic);

      pulled = electronicsIter.next();
    }

    /* Start Traverse Each Electronic */
    electronics.forEach(traverseFromElectronic);

    return graph;
  }

  private mapElectronicUnitWithCircuitUnit(
    e: IElectronic,
    callback: (
      eu: ElectronicUnit,
      cu: CircuitUnit,
      relativeCoord: Coordinate,
    ) => void,
  ) {
    const { coordinate: [x, y], dimension: d, center: [cx, cy] } = e;

    for (let row = 0; row < d.length; row += 1) {
      for (let col = 0; col < d[row].length; col += 1) {
        const [relX, relY] = [x - (cx - col), y - (cy - row)];
        const eu = d[row][col];
        const cu = this.layout[relY][relX];
        callback(eu, cu, [relX, relY]);
      }
    }
  }
};
