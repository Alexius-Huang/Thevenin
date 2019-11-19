import { ConnectableDirection } from './circuit.lib';
import { IElectronic } from './Electronic';

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
  electronic: IElectronic;
  pinName: string;
};

export type CircuitConnection = CircuitUnit | ElectronicConnection | null;

export default class CircuitUnit {
  public isNode = false;
  public isLocked = false;
  public electronicID: null | string = null;
  public connectedDirections = new Set<ConnectableDirection>();

  public left:   CircuitConnection = null;
  public right:  CircuitConnection = null;
  public top:    CircuitConnection = null;
  public bottom: CircuitConnection = null;

  public isDirectionConnectable(direction: ConnectableDirection) {
    return !this.connectedDirections.has(direction);
  }

  public connect(direction: ConnectableDirection, connectedUnit: CircuitUnit | ElectronicConnection) {
    if (this.connectedDirections.has(direction))
      throw new Error(`Direction \`${direction}\` has already connected`);
    this.connectedDirections.add(direction);
    this[direction] = connectedUnit;
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
