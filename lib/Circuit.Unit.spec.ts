import Unit, { CircuitUnitType } from './Circuit.Unit';
import { ConnectableDirection } from './circuit.lib';

const directions: ConnectableDirection[] = ['left', 'right', 'top', 'bottom'];
let unit: Unit;

describe('Lib: Circuit.Unit', () => {
  it('creates the Circuit.Unit instance', () => {
    unit = new Unit();
    expect(unit.isNode).toBe(false);

    directions.forEach(d => {
      expect(unit.isDirectionConnectable(d)).toBe(true);
    });
  });

  it('derives state of the node', () => {
    const testCases: Array<[
      ConnectableDirection[],
      { isLocked?: boolean, isNode?: boolean, electronicID?: string },
      CircuitUnitType
    ]> = [
      //   |
      // - + -  Fully available
      //   |
      [[], {}, CircuitUnitType.Available],

      //   X
      // - + -  Wire crossed from top to bottom
      //   X
      // [['top', 'bottom'], {}, CircuitUnitType.HorizontallyAvailable],
      [['top', 'bottom'], {}, CircuitUnitType.PartiallyAvailable],

      //   |
      // X + X  Wire crossed from left to right
      //   |
      // [['left', 'right'], {}, CircuitUnitType.VerticallyAvailable],
      [['left', 'right'], {}, CircuitUnitType.PartiallyAvailable],

      //   |
      // - L -  Simple electronic component
      //   |
      [[], { electronicID: '123' }, CircuitUnitType.Electronic],

      //   |
      // X + -  Open wire
      //   |
      [['left'], {}, CircuitUnitType.PartiallyAvailable],

      //   |
      // X + -  Turn-around wire
      //   X
      // [['left', 'bottom'], {}, CircuitUnitType.Occupied],
      [['left', 'bottom'], {}, CircuitUnitType.PartiallyAvailable],

      //   |
      // X N -  Intersection
      //   X
      [['left', 'bottom'], { isNode: true }, CircuitUnitType.PartiallyAvailable],

      //   X
      // X N X  Intersection
      //   |
      [['left', 'top', 'right'], { isNode: true }, CircuitUnitType.PartiallyAvailable],
    ];

    testCases.forEach(([directions, { isLocked, isNode, electronicID }, result], i) => {
      unit = new Unit();
      unit.isLocked = typeof isLocked === 'boolean' ? isLocked : false;
      unit.isNode = typeof isNode === 'boolean' ? isNode : false;
      unit.electronicID = typeof electronicID === 'string' ? electronicID : null;
      directions.forEach(d => {
        const attachedUnit = new Unit();
        unit.connect(d, attachedUnit);
      });
      expect(unit.type).toBe(result);
    });
  });
});
