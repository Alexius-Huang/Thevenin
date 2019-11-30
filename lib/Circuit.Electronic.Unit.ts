import { ConnectableDirection } from './circuit.lib';

export enum ElectronicUnitType {
  // Unit,  // Occupies only one space, currently unimplemented
  Pin,      // Bigger component's pin
  Occupied, // Bigger component's concrete part
};

export default class ElectronicUnit {
  constructor(
    public readonly type: ElectronicUnitType,
    public connectDirection: ConnectableDirection | null,
    public readonly pinName: string = ''
  ) {}

  private static invertedDirection: {
    [key: string]: ConnectableDirection,
  } = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
  };

  private static rotatedDirection: {
    [key: string]: ConnectableDirection,
  } = {
    left: 'top',
    right: 'bottom',
    top: 'right',
    bottom: 'left'
  };

  get circuitConnectDirection() {
    if (this.connectDirection === null) throw new Error('Electronic Unit is not a pin!');
    return ElectronicUnit.invertedDirection[this.connectDirection];
  }

  public rotate() {
    if (this.connectDirection !== null) {
      this.connectDirection = ElectronicUnit.rotatedDirection[this.connectDirection];
    }
  }

  static Occupied:  ElectronicUnit = new ElectronicUnit(ElectronicUnitType.Occupied, null);

  static createPin(direction: ConnectableDirection, pinName?: string) {
    return new ElectronicUnit(ElectronicUnitType.Pin, direction, pinName);
  }
}
