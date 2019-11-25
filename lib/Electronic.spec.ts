import { createElectronic, EC } from './Electronic';
import ElectronicUnit from './Electronic.Unit';

describe('Lib: Electronic', () => {
  describe('Electronic Component Rotation', () => {
    it ('rotates electronic component clockwisely', () => {
      const beforeRotationResult = [
        [ElectronicUnit.createPin('left', '1'), ElectronicUnit.Occupied, ElectronicUnit.createPin('right', '2')]
      ];
      const quarterRotationResult = [
        [ElectronicUnit.createPin('top', '1')],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.createPin('bottom', '2')],
      ];
      const halfRotationResult = [
        [ElectronicUnit.createPin('left', '2'), ElectronicUnit.Occupied, ElectronicUnit.createPin('right', '1')]
      ];
      const thirdQuarterRotationResult = [
        [ElectronicUnit.createPin('top', '2')],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.createPin('bottom', '1')],
      ];
  
      const resistor = createElectronic(
        EC.Resistor,
        { coordinate: [1, 0] },
      );

      expect(resistor.dimension).toMatchObject(beforeRotationResult);
      expect(resistor.center).toMatchObject([1, 0]);
      resistor.rotate();
      expect(resistor.dimension).toMatchObject(quarterRotationResult);
      expect(resistor.center).toMatchObject([0, 1]);
      resistor.rotate();
      expect(resistor.dimension).toMatchObject(halfRotationResult);
      expect(resistor.center).toMatchObject([1, 0]);
      resistor.rotate();
      expect(resistor.dimension).toMatchObject(thirdQuarterRotationResult);
      expect(resistor.center).toMatchObject([0, 1]);
      resistor.rotate();
      expect(resistor.dimension).toMatchObject(beforeRotationResult);
      expect(resistor.center).toMatchObject([1, 0]);
    });

    it ('rotates electronic component along with pin', () => {
      const beforeRotationResult = [
        [ElectronicUnit.createPin('left', 'POSITIVE'), ElectronicUnit.Occupied, ElectronicUnit.createPin('right', 'NEGATIVE')]
      ];
      const quarterRotationResult = [
        [ElectronicUnit.createPin('top', 'POSITIVE')],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.createPin('bottom', 'NEGATIVE')],
      ];
      const halfRotationResult = [
        [ElectronicUnit.createPin('left', 'NEGATIVE'), ElectronicUnit.Occupied, ElectronicUnit.createPin('right', 'POSITIVE')]
      ];
      const thirdQuarterRotationResult = [
        [ElectronicUnit.createPin('top', 'NEGATIVE')],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.createPin('bottom', 'POSITIVE')],
      ];
  
      const source = createElectronic(
        EC.DCSource,
        { coordinate: [1, 0] },
      );

      expect(source.dimension).toMatchObject(beforeRotationResult);
      expect(source.center).toMatchObject([1, 0]);
      source.rotate();
      expect(source.dimension).toMatchObject(quarterRotationResult);
      expect(source.center).toMatchObject([0, 1]);
      source.rotate();
      expect(source.dimension).toMatchObject(halfRotationResult);
      expect(source.center).toMatchObject([1, 0]);
      source.rotate();
      expect(source.dimension).toMatchObject(thirdQuarterRotationResult);
      expect(source.center).toMatchObject([0, 1]);
      source.rotate();
      expect(source.dimension).toMatchObject(beforeRotationResult);
      expect(source.center).toMatchObject([1, 0]);
    });
  });  
});
