import { ConnectableDirection } from './circuit.lib';

export enum ElectronicUnitType {
  // Unit,  // Occupies only one space, currently unimplemented
  Pin,      // Bigger component's pin
  Occupied, // Bigger component's concrete part
};

export default class ElectronicUnit {
  constructor(
    public readonly type: ElectronicUnitType,
    public readonly connectDirection: ConnectableDirection | null,
    public readonly meta: string = ''
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

  static LeftPin:   ElectronicUnit = ElectronicUnit.createLeftPin();
  static RightPin:  ElectronicUnit = ElectronicUnit.createRightPin();
  static TopPin:    ElectronicUnit = ElectronicUnit.createTopPin();
  static BottomPin: ElectronicUnit = ElectronicUnit.createBottomPin();
  static Occupied:  ElectronicUnit = new ElectronicUnit(ElectronicUnitType.Occupied, null);

  private static createPin(direction: ConnectableDirection, meta?: string) {
    return new ElectronicUnit(ElectronicUnitType.Pin, direction, meta);
  }

  public static createLeftPin(meta?: string) {
    return ElectronicUnit.createPin('left', meta);
  }

  public static createRightPin(meta?: string) {
    return ElectronicUnit.createPin('right', meta);
  }

  public static createTopPin(meta?: string) {
    return ElectronicUnit.createPin('top', meta);
  }

  public static createBottomPin(meta?: string) {
    return ElectronicUnit.createPin('bottom', meta);
  }
}
