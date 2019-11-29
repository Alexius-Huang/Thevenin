import Electronic, { Coordinate } from './Electronic';
import Unit, { CircuitUnitType } from './Circuit.Unit';
import ElectronicUnit, { ElectronicUnitType } from './Electronic.Unit';
import Graph, { Node, Edge, PinInfoMap, PinInfo, CurrentFlow } from './Circuit.Graph';
import CircuitUnit from './Circuit.Unit';
import { CircuitUnitConnection, Connection } from './Circuit.Connection';
import { ConnectableDirection } from './circuit.lib';
import Simulation from './Circuit.Simulation';

export default class Circuit {
  static Graph = Graph;
  public electronics = new Map<string, Electronic>();
  public layout: Array<Array<Unit>>;

  constructor(public columns: number, public rows: number) {
    this.layout = Array.from(Array(rows)).map(() =>
      Array.from(Array(columns)).map(() => new Unit())
    );
  }

  public run() {
    const graph = this.deriveGraph();
    const simulation = new Simulation(graph);
    simulation.run();
    this.mapGraphToCircuitLayout(simulation.graph);
  }

  public addJoint(c1: Coordinate, c2: Coordinate) {
    let [[col1, row1], [col2, row2]] = [c1, c2];
    const [cu1, cu2] = [this.layout[row1][col1], this.layout[row2][col2]];

    const [deltaCol, deltaRow] = [col2 - col1, row2 - row1]; 
    if (Math.abs(deltaCol) === 1 && deltaRow === 0) {
      cu1.connect(deltaCol > 0 ? 'right' : 'left', cu2);
    } else if (Math.abs(deltaRow) === 1 && deltaCol === 0) {
      cu1.connect(deltaRow > 0 ? 'bottom' : 'top', cu2);
    } else {
      throw new Error('Invalid circuit joint connection!');
    }
  }

  public canAddJoint(c1: Coordinate, c2: Coordinate) {
    let [[col1, row1], [col2, row2]] = [c1, c2];
    const [cu1, cu2] = [this.layout[row1][col1], this.layout[row2][col2]];

    if (
      cu1.type === CircuitUnitType.Electronic || cu2.type === CircuitUnitType.Electronic ||
      cu1.type === CircuitUnitType.Occupied || cu2.type === CircuitUnitType.Occupied
    ) return false;

    if (cu1.type === CircuitUnitType.Available && cu2.type === CircuitUnitType.Available) return true;

    const [deltaCol, deltaRow] = [col2 - col1, row2 - row1];

    let direction: ConnectableDirection, invertedDirection: ConnectableDirection;
    if (Math.abs(deltaCol) === 1 && deltaRow === 0) {
      direction = deltaCol > 0 ? 'right' : 'left';
      invertedDirection = direction === 'right' ? 'left' : 'right';
    } else if (Math.abs(deltaRow) === 1 && deltaCol === 0) {
      direction = deltaRow > 0 ? 'bottom' : 'top';
      invertedDirection = direction === 'bottom' ? 'top' : 'bottom';
    } else {
      throw new Error('Invalid circuit joint connection!');
    }

    return (cu1[direction] === null && cu2[invertedDirection] === null);
  }

  public appendElectronics(e: Electronic) {
    this.mapElectronicUnitWithCircuitUnit(e, (eu, cu) => {
      if (eu.type === ElectronicUnitType.Pin) {
        cu.connect(eu.circuitConnectDirection, { electronic: e, pinName: eu.pinName });
      } else if (eu.type === ElectronicUnitType.Occupied) {
        cu.setElectronic(e.id);
      } else {
        throw new Error(`Electronic Unit type ${ElectronicUnitType[eu.type]} isn't declared`);
      }
    });

    this.electronics.set(e.id, e);
  }

  public canAttachComponent(e: Electronic): boolean {
    try {
      this.mapElectronicUnitWithCircuitUnit(e, (eu, cu, [relX, relY]) => {
        const isOutOfBound = (relX < 0 || relY < 0 || relX >= this.columns || relY >= this.rows);
  
        if (
          // Out of bound will considered to be not attachable
          isOutOfBound ||

          // Unit already represented as part of the electronic components or occupied are consider to be not attachable
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

  public deriveGraph(): Graph {
    const graph = new Circuit.Graph();

    const traversedCircuitUnit = new Set<CircuitUnit>();
    const electronicEdgeMap = new Map<string, Edge>();

    let traverseFromElectronic = (e: Electronic) => {
      this.mapElectronicUnitWithCircuitUnit(e, (eu, cu) => {
        const { connectDirection: connectDir } = eu;

        // Check if it is pin and if the pin is already traversed or not
        if (connectDir !== null && !traversedCircuitUnit.has(cu)) {
          traverseFromCircuitUnit(cu);
        }
      });
    }

    let traverseFromCircuitUnit = (cu: CircuitUnit, linkedNode?: Node) => {
      traversedCircuitUnit.add(cu);
      const node = linkedNode || graph.createNode();
      const connections: Array<Connection | null> = [cu.top, cu.right, cu.bottom, cu.left];

      connections.forEach(connection => {
        if (connection === null) return;

        if (connection instanceof CircuitUnitConnection) {
          if (!traversedCircuitUnit.has(connection.unit))
            traverseFromCircuitUnit(connection.unit, node);
        } else {
          const edge = electronicEdgeMap.get(connection.electronic.id) as Edge;
          edge.connect(node, connection.pinName);
        }
      });
    }

    const electronicsIter = this.electronics.values();
    const electronics: Array<Electronic> = [];
    let pulled = electronicsIter.next();

    while (!pulled.done) {
      const electronic = pulled.value;
      const edge = graph.createEdge(electronic);
      electronicEdgeMap.set(electronic.id, edge);
      electronics.push(electronic);

      pulled = electronicsIter.next();
    }

    /* Start Traverse Each Electronic */
    electronics.forEach(traverseFromElectronic);

    return graph;
  }

  public mapGraphToCircuitLayout(graph: Graph) {
    const unresolvedUnits = new Set<Unit>();

    /* Assign all voltage and current to electronic mapped circuit unit */
    this.electronics.forEach(e => {
      const edge = graph.findEdge(e.id);
      this.mapElectronicUnitWithCircuitUnit(e, (eu, cu) => {
        if (eu.type === ElectronicUnitType.Pin) {
          const node = edge.nodesMap.get(eu.pinName) as Node;
          const pinInfoMap = node.edgePinInfoMap.get(e.id) as PinInfoMap;
          const { bias, currentFlow } = pinInfoMap.get(eu.pinName) as PinInfo;
          cu.voltage = node.voltage + bias;

          const connection = cu[eu.circuitConnectDirection] as Connection;
          connection.currentFlow = (
            currentFlow === CurrentFlow.INWARD ? CurrentFlow.OUTWARD :
            currentFlow === CurrentFlow.OUTWARD ? CurrentFlow.INWARD : CurrentFlow.NEUTRAL
          );
          connection.current = edge.current;

          const conns = cu.circuitUnitConnections;
          let resolved = true;
          for (let { connection: conn } of conns) {
            if (Number.isNaN(conn.current)) {
              resolved = false;
              break;
            }
          }

          unresolvedUnits[resolved ? 'delete' : 'add'](cu);
        }
      });
    });

    /* KVL & KCL Propagation */
    do {
      for (let cu of Array.from(unresolvedUnits)) {
        if (!unresolvedUnits.has(cu)) continue;

        const conns = cu.circuitUnitConnections;
        let isReadyToResolve = true;
        let connectionWithUnknownCurrent: CircuitUnitConnection | undefined;
        let unknownCurrentDir: ConnectableDirection | undefined;
        let KCLCurrentCumulation = 0;

        /* Assign and check voltage in surrounding connections */
        conns.forEach(({ connection: conn, direction: dir }) => {
          const connectedUnit = conn.unit;
          /* Voltage Assignment */
          if (Number.isNaN(connectedUnit.voltage))
            conn.unit.voltage = cu.voltage;
          else if (connectedUnit.voltage !== cu.voltage)
            throw new Error('Inequipotential Voltage Detected!');

          /* Current Calculation */
          if (isReadyToResolve)
            if (Number.isNaN(conn.current))
              if (connectionWithUnknownCurrent === undefined) {
                connectionWithUnknownCurrent = conn;
                unknownCurrentDir = dir;
              }
              else
                isReadyToResolve = false;

            else if (conn.current !== 0)
              KCLCurrentCumulation += (
                conn.currentFlow === CurrentFlow.INWARD ? conn.current : -conn.current
              );
        });

        /* Apply KCL to solve the unresolved connection's current */
        if (isReadyToResolve && connectionWithUnknownCurrent !== undefined && unknownCurrentDir !== undefined) {
          cu.electronicUnitConnections.forEach(({ connection: econn }) => {
            KCLCurrentCumulation += (
              econn.currentFlow === CurrentFlow.INWARD ? econn.current : -econn.current
            );
          });

          const currentValue = Math.abs(KCLCurrentCumulation);
          const currentFlow = (
            KCLCurrentCumulation > 0 ? CurrentFlow.OUTWARD :
            KCLCurrentCumulation < 0 ? CurrentFlow.INWARD : CurrentFlow.NEUTRAL
          );
          const relativeCurrentFlow = (
            currentFlow === CurrentFlow.INWARD ? CurrentFlow.OUTWARD :
            currentFlow === CurrentFlow.OUTWARD ? CurrentFlow.INWARD : CurrentFlow.NEUTRAL
          );

          connectionWithUnknownCurrent.current = currentValue;
          connectionWithUnknownCurrent.currentFlow = currentFlow;

          let connectedCUDir: ConnectableDirection;
          if (unknownCurrentDir === 'left')
            connectedCUDir = 'right';
          else if (unknownCurrentDir === 'right')
            connectedCUDir = 'left';
          else if (unknownCurrentDir === 'top')
            connectedCUDir = 'bottom';
          else
            connectedCUDir = 'top';

          const connectedUnit = connectionWithUnknownCurrent.unit;
          (connectedUnit[connectedCUDir] as Connection).current = currentValue;
          (connectedUnit[connectedCUDir] as Connection).currentFlow = relativeCurrentFlow;

          /* Check next unit is resolved or not */
          let connectedUnitIsResolved = true;
          for (let { connection: conn } of connectedUnit.connections) {
            if (Number.isNaN(conn.current)) {
              connectedUnitIsResolved = false;
              break;
            }
          }
          unresolvedUnits[connectedUnitIsResolved ? 'delete' : 'add'](connectedUnit);
        }

        if (isReadyToResolve) unresolvedUnits.delete(cu);
      }
    } while (unresolvedUnits.size !== 0)
  }

  private mapElectronicUnitWithCircuitUnit(
    e: Electronic,
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
