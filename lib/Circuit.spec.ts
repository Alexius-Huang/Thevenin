import Circuit, { PinState } from './Circuit';
import { createElectronic, EC } from './Electronic';

function createCircuitGrid(row: number, col: number) {
  return Array.from(Array(row)).map(() =>
    Array.from(Array(col)).map(() => PinState.Available)
  );
}

let circuit: Circuit;
let result: Array<Array<PinState>>;

beforeEach(() => {
  circuit = new Circuit(5, 5);
  result = createCircuitGrid(5, 5);
});

describe('Lib: Circuit', () => {
  
  it('creates a circuit instance', () => {
    expect(circuit.layout).toMatchObject(result);
    expect(circuit.electronics).toMatchObject([]);
  });


  describe('Electronic Components', () => {
    it('attach resistors', () => {
      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [1, 0]
        })
      );

      result[0][0] = PinState.Pin;
      result[0][1] = PinState.Occupied;
      result[0][2] = PinState.Pin;
      expect(circuit.electronics.length).toBe(1);
      expect(circuit.layout).toMatchObject(result);

      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [3, 2]
        })
      );

      result[2][2] = PinState.Pin;
      result[2][3] = PinState.Occupied;
      result[2][4] = PinState.Pin;
      expect(circuit.electronics.length).toBe(2);
      expect(circuit.layout).toMatchObject(result);
    });
  });
});
