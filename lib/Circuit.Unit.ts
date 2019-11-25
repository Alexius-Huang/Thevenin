import { ConnectableDirection } from './circuit.lib';
import { Connection, ElectronicUnitConnection, CircuitUnitConnection } from './Circuit.Connection';
import Electronic from './Electronic';

export enum CircuitUnitType {
  Available,             // all direction
  PartiallyAvailable,    // only three / one direction is occupied or isnode and two direction is occupied
  HorizontallyAvailable, // top-bottom direction is occupied
  VerticallyAvailable,   // left-right direction is occupied

  // intersection/turn-around wires or locked circuit-unit
  // usually occupied state of the electronics is locked state
  Occupied,

  Electronic,

  // Invalid,
}

export type ElectronicConnection = {
  electronic: Electronic;
  pinName: string;
};

const invertDirectionMap: { [key: string]: ConnectableDirection } = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
};

export default class CircuitUnit {
  public isNode = false;
  public isLocked = false;
  public electronicID: null | string = null;
  public connectedDirections = new Set<ConnectableDirection>();

  public left:   Connection | null = null;
  public right:  Connection | null = null;
  public top:    Connection | null = null;
  public bottom: Connection | null = null;

  public isDirectionConnectable(direction: ConnectableDirection) {
    return !this.connectedDirections.has(direction);
  }

  public connect(direction: ConnectableDirection, connected: CircuitUnit | ElectronicConnection) {
    if (this.connectedDirections.has(direction))
      throw new Error(`Direction \`${direction}\` has already connected`);
    this.connectedDirections.add(direction);

    if (connected instanceof CircuitUnit) {
      this[direction] = new CircuitUnitConnection(connected);
      const invDir = invertDirectionMap[direction];
      connected[invDir] = new CircuitUnitConnection(this);
      connected.connectedDirections.add(invDir);
    } else {
      this[direction] = new ElectronicUnitConnection(connected.electronic, connected.pinName);
    }
  }

  public setOccupied() {
    this.disconnectAll();
    this.isLocked = true;
  }

  public setElectronic(id: string) {
    this.electronicID = id;
    this.isLocked = true;
  }

  public disconnect(direction: ConnectableDirection) {
    if (!this.connectedDirections.has(direction))
      throw new Error(`Direction \`${direction}\` has already disconnected`);
    this.connectedDirections.delete(direction);

    const connectedUnit = this[direction];
    if (connectedUnit instanceof CircuitUnit) {
      const invDir = invertDirectionMap[direction];
      connectedUnit[invDir] = null;
      connectedUnit.connectedDirections.delete(invDir);
    }

    this[direction] = null;
  }

  public disconnectAll() {
    this.connectedDirections.clear();
  }

  get availablePinCount() {
    return 4 - this.connectedDirections.size;
  }

  get type() {
    if (this.electronicID !== null) return CircuitUnitType.Electronic;

    const AD = this.availablePinCount;
    if (this.isLocked || AD === 0) return CircuitUnitType.Occupied;

    if (AD === 4) return CircuitUnitType.Available;
    if (AD === 3 || AD === 1) return CircuitUnitType.PartiallyAvailable;

    if (
      this.connectedDirections.has('left') &&
      this.connectedDirections.has('right')
    ) return CircuitUnitType.VerticallyAvailable;

    if (
      this.connectedDirections.has('top') &&
      this.connectedDirections.has('bottom')
    ) return CircuitUnitType.HorizontallyAvailable;

    if (this.isNode) return CircuitUnitType.PartiallyAvailable;

    return CircuitUnitType.Occupied;
  }
}
