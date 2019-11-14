export enum UnitState {
  Available,             // all direction
  PartiallyAvailable,    // only three / one direction is occupied or isnode and two direction is occupied
  HorizontallyAvailable, // top-bottom direction is occupied
  VerticallyAvailable,   // left-right direction is occupied

  // intersection/turn-around wires or locked circuit-unit
  // usually occupied state of the electronics is locked state
  Occupied,

  // Invalid,
}

export type ConnectableDirection = 'left' | 'right' | 'top' | 'bottom';

export default class Unit {
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

  public disconnect(direction: ConnectableDirection) {
    if (!this.connectedDirections.has(direction))
      throw new Error(`Direction \`${direction}\` has already disconnected`);
    this.connectedDirections.delete(direction);
  }

  get availableDirections() {
    return 4 - this.connectedDirections.size;
  }

  get state() {
    const AD = this.availableDirections;
    if (this.isLocked || AD === 0) return UnitState.Occupied;

    if (AD === 4) return UnitState.Available;
    if (AD === 3 || AD === 1) return UnitState.PartiallyAvailable;

    if (
      this.connectedDirections.has('left') &&
      this.connectedDirections.has('right')
    ) return UnitState.VerticallyAvailable;

    if (
      this.connectedDirections.has('top') &&
      this.connectedDirections.has('bottom')
    ) return UnitState.HorizontallyAvailable;

    if (this.isNode) return UnitState.PartiallyAvailable;

    return UnitState.Occupied;
  }
}
