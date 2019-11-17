import { ConnectableDirection } from './circuit.lib';

export enum CircuitUnitType {
  Available,             // all direction
  PartiallyAvailable,    // only three / one direction is occupied or isnode and two direction is occupied
  HorizontallyAvailable, // top-bottom direction is occupied
  VerticallyAvailable,   // left-right direction is occupied

  // intersection/turn-around wires or locked circuit-unit
  // usually occupied state of the electronics is locked state
  Occupied,

  // Invalid,
}

export default class CircuitUnit {
  public isNode = false;
  public isLocked = false;
  private connectedDirections = new Set<ConnectableDirection>([]);

  public isDirectionConnectable(direction: ConnectableDirection) {
    return !this.connectedDirections.has(direction);
  }

  public connect(direction: ConnectableDirection) {
    if (this.connectedDirections.has(direction))
      throw new Error(`Direction \`${direction}\` has already connected`);
    this.connectedDirections.add(direction);
  }

  public setOccupied() {
    this.disconnectAll();
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

  get availableDirections() {
    return 4 - this.connectedDirections.size;
  }

  get type() {
    const AD = this.availableDirections;
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
