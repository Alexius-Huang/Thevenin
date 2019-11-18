import { createElectronic, EC } from './Electronic';
import ElectronicUnit from './Electronic.Unit';

describe('Lib: Electronic', () => {
  describe('Electronic Component Rotation', () => {
    it ('rotates electronic component clockwisely', () => {
      const beforeRotationResult = [
        [ElectronicUnit.LeftPin, ElectronicUnit.Occupied, ElectronicUnit.RightPin]
      ];
      const quarterRotationResult = [
        [ElectronicUnit.TopPin],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.BottomPin],
      ];
      const halfRotationResult = [
        [ElectronicUnit.LeftPin, ElectronicUnit.Occupied, ElectronicUnit.RightPin]
      ];
      const thirdQuarterRotationResult = [
        [ElectronicUnit.TopPin],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.BottomPin],
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

    it ('rotates electronic component along with meta info', () => {
      const beforeRotationResult = [
        [ElectronicUnit.createLeftPin('POSITIVE'), ElectronicUnit.Occupied, ElectronicUnit.createRightPin('NEGATIVE')]
      ];
      const quarterRotationResult = [
        [ElectronicUnit.createTopPin('POSITIVE')],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.createBottomPin('NEGATIVE')],
      ];
      const halfRotationResult = [
        [ElectronicUnit.createLeftPin('NEGATIVE'), ElectronicUnit.Occupied, ElectronicUnit.createRightPin('POSITIVE')]
      ];
      const thirdQuarterRotationResult = [
        [ElectronicUnit.createTopPin('NEGATIVE')],
        [ElectronicUnit.Occupied],
        [ElectronicUnit.createBottomPin('POSITIVE')],
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
