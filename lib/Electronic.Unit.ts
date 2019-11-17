import { ConnectableDirection } from './circuit.lib';

export enum ElectronicUnitType { Pin, Occupied };

export default class ElectronicUnit {
  static LeftPin:   ElectronicUnit = ElectronicUnit.createLeftPin();
  static RightPin:  ElectronicUnit = ElectronicUnit.createRightPin();
  static TopPin:    ElectronicUnit = ElectronicUnit.createTopPin();
  static BottomPin: ElectronicUnit = ElectronicUnit.createBottomPin();
  static Occupied:  ElectronicUnit = new ElectronicUnit(ElectronicUnitType.Occupied, null);

  constructor(
    public readonly type: ElectronicUnitType,
    public readonly connectDirection: ConnectableDirection | null
  ) {}

  private static invertedDirection: {
    [key: string]: ConnectableDirection,
  } = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
  };

  get circuitConnectDirection() {
    if (this.connectDirection === null) throw new Error('Electronic Unit is not a pin!');
    return ElectronicUnit.invertedDirection[this.connectDirection];
  }

  private static createPin(direction: ConnectableDirection) {
    return new ElectronicUnit(ElectronicUnitType.Pin, direction);
  }

  private static createLeftPin() {
    return this.createPin('left');
  }

  private static createRightPin() {
    return this.createPin('right');
  }

  private static createTopPin() {
    return this.createPin('top');
  }

  private static createBottomPin() {
    return this.createPin('bottom');
  }
}
