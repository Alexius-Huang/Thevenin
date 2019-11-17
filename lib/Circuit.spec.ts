import Circuit from './Circuit';
import Unit from './Circuit.Unit';
import { createElectronic, EC } from './Electronic';
// import { ElectronicUnitType } from './Electronic.Unit';

function createCircuitGrid(row: number, col: number) {
  return Array.from(Array(row)).map(() =>
    Array.from(Array(col)).map(() => new Unit())
  );
}

let circuit: Circuit;
let result: Array<Array<Unit>>;

beforeEach(() => {
  circuit = new Circuit(5, 5);
  result = createCircuitGrid(5, 5);
});

describe('Lib: Circuit', () => {
  it('creates a circuit instance', () => {
    expect(circuit.layout).toMatchObject(result);
    expect(circuit.electronics).toMatchObject([]);
  });

  // describe('Circuit.canAttachComponent', () => {
  //   it('returns false if component isn\'t attachable', () => {
  //     // [[a, n, o, n, a]]
  //     circuit.appendElectronics(
  //       createElectronic(EC.Resistor, {
  //         coordinate: [2, 0]
  //       })
  //     );

  //     const testCases: Array<[Coordinate, boolean]> = [
  //       [[1, 0], false],
  //       [[3, 0], false],
  //       [[4, 0], false],
  //       [[2, 1],  true],
  //       [[4, 1], false],
  //       [[1, 1],  true],
  //       [[0, 1], false],
  //     ];

  //     testCases.forEach(([coordinate, result]) => {
  //       expect(
  //         circuit.canAttachComponent(
  //           createElectronic(EC.Resistor, { coordinate })
  //         )
  //       ).toBe(result);  
  //     });
  //   });
  // });

  describe('Electronic Components', () => {
    it('attach resistors', () => {
      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [1, 0]
        })
      );

      result[0][0].connect('right');
      result[0][1].isLocked = true;
      result[0][2].connect('left');
      expect(circuit.electronics.length).toBe(1);
      expect(circuit.layout).toMatchObject(result);

      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [3, 2]
        })
      );

      result[2][2].connect('right');
      result[2][3].isLocked = true;
      result[2][4].connect('left');
      expect(circuit.electronics.length).toBe(2);
      expect(circuit.layout).toMatchObject(result);
    });
  });
});
