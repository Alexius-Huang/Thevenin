import Unit, { ConnectableDirection, UnitState } from './Circuit.Unit';

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
      { isLocked?: boolean, isNode?: boolean },
      UnitState
    ]> = [
      //   |
      // - + -  Fully available
      //   |
      [[], {}, UnitState.Available],

      //   X
      // - + -  Wire crossed from top to bottom
      //   X
      [['top', 'bottom'], {}, UnitState.HorizontallyAvailable],

      //   |
      // X + X  Wire crossed from left to right
      //   |
      [['left', 'right'], {}, UnitState.VerticallyAvailable],

      //   |
      // X L X  Simple electronic component
      //   |
      [['left', 'right'], { isLocked: true }, UnitState.Occupied],

      //   |
      // X + -  Open wire
      //   |
      [['left'], {}, UnitState.PartiallyAvailable],

      //   |
      // X + -  Turn-around wire
      //   X
      [['left', 'bottom'], {}, UnitState.Occupied],

      //   |
      // X N -  Intersection
      //   X
      [['left', 'bottom'], { isNode: true }, UnitState.PartiallyAvailable],

      //   X
      // X N X  Intersection
      //   |
      [['left', 'top', 'right'], { isNode: true }, UnitState.PartiallyAvailable],
    ];

    testCases.forEach(([directions, { isLocked, isNode }, result], i) => {
      unit = new Unit();
      unit.isLocked = typeof isLocked === 'boolean' ? isLocked : false;
      unit.isNode = typeof isNode === 'boolean' ? isNode : false;
      directions.forEach(d => unit.connect(d));
      expect(unit.state).toBe(result);
    });
  });
});
