import Circuit from './Circuit';
import Unit from './Circuit.Unit';
import Electronic, { createElectronic, EC, Coordinate } from './Electronic';

let circuit: Circuit;
let result: Array<Array<Unit>>;


function createCircuitGrid(col: number, row: number) {
  return Array.from(Array(row)).map(() =>
    Array.from(Array(col)).map(() => new Unit())
  );
}

function resetCircuitGrid(w: number, h?: number) {
  circuit = new Circuit(w, h || w);
  result = createCircuitGrid(w, h || w);
}

beforeEach(() => {
  resetCircuitGrid(5);
});

describe('Lib: Circuit', () => {
  it('creates a circuit instance', () => {
    expect(circuit.layout).toMatchObject(result);
    expect(circuit.electronics).toMatchObject(new Map<string, Electronic>());
  });

  describe('Circuit.canAttachComponent', () => {
    describe('Out of Bound Error', () => {
      it('returns false if to-be attached component is out of circuit bound', () => {
        const testCases: Array<[Coordinate, boolean]> = [
          [[2, 1],  true],  // -> No Confliction
          [[4, 1], false],  // -> Out of Bound
          [[1, 1],  true],  // -> No Confliction
          [[0, 1], false],  // -> Out of Bound
        ];
  
        testCases.forEach(([coordinate, result]) => {
          expect(
            circuit.canAttachComponent(
              createElectronic(EC.Resistor, { coordinate })
            )
          ).toBe(result);  
        });
      });  
    });

    describe('Components Confliction Error', () => {
      it('returns false if to-be attached component is overlapped to another component', () => {
        // [[a, n, o, n, a]]
        circuit.appendElectronics(
          createElectronic(EC.Resistor, {
            coordinate: [2, 0]
          })
        );
  
        const testCases: Array<[Coordinate, boolean]> = [
          [[1, 0], false],  // -> Confliction
          [[3, 0], false],  // -> Confliction
          [[4, 0], false],  // -> Confliction
        ];
  
        testCases.forEach(([coordinate, result]) => {
          expect(
            circuit.canAttachComponent(
              createElectronic(EC.Resistor, { coordinate })
            )
          ).toBe(result);
        });
      });

      it('returns false if to-be attached component is partially conflicted to another component', () => {
        resetCircuitGrid(6, 2);

        // [[n, o, n, a, a, a]]
        // [[a, a, a, n, o, n]]
        circuit.appendElectronics(
          createElectronic(EC.Resistor, {
            coordinate: [1, 0]
          })
        );
        circuit.appendElectronics(
          createElectronic(EC.Resistor, {
            coordinate: [4, 1]
          })
        );

        const testCases: Array<[Coordinate, boolean]> = [
          [[2, 0], false],
          [[3, 0], true],
          [[3, 1], false],
          [[2, 1], true],
        ];
  
        testCases.forEach(([coordinate, result]) => {
          const e = createElectronic(EC.Resistor, { coordinate });
          const testResult = circuit.canAttachComponent(e);
          expect(testResult).toBe(result);
        });
      });

      it('returns false if to-be attached component\'s pin is blocked by another component', () => {
        // [ a a n a a ]
        // [ a a o a a ]
        // [ a n E n a ]
        // [ a a a a a ]
        // [ a a a a a ]
        const resistor1 = createElectronic(EC.Resistor, { coordinate: [2, 2] });
        const resistor2 = createElectronic(EC.Resistor, { coordinate: [2, 1] });
        resistor2.rotate();

        circuit.appendElectronics(resistor1);
        result[2][1].connect('right', { electronic: resistor1, pinName: '1' });
        result[2][2].setElectronic(resistor1.id);
        result[2][3].connect('left', { electronic: resistor1, pinName: '2' });

        expect(circuit.layout).toMatchObject(result);
        expect(circuit.canAttachComponent(resistor2)).toBe(false);
      });
    });
  });

  describe('Attaching Components', () => {
    it('performs simple attachment', () => {
      const resistor = createElectronic(EC.Resistor, { coordinate: [1, 0] });
      circuit.appendElectronics(resistor);

      result[0][0].connect('right', { electronic: resistor, pinName: '1' });
      result[0][1].setElectronic(resistor.id);
      result[0][2].connect('left', { electronic: resistor, pinName: '2' });
      expect(circuit.electronics.size).toBe(1);
      expect(circuit.layout).toMatchObject(result);

      const resistor2 = createElectronic(EC.Resistor, { coordinate: [3, 2] });
      circuit.appendElectronics(resistor2);

      result[2][2].connect('right', { electronic: resistor2, pinName: '1' });
      result[2][3].setElectronic(resistor2.id);
      result[2][4].connect('left', { electronic: resistor2, pinName: '2' });
      expect(circuit.electronics.size).toBe(2);
      expect(circuit.layout).toMatchObject(result);
    });

    it('performs rotated components simple attachment', () => {
      const resistor = createElectronic(EC.Resistor, { coordinate: [1, 1] });
      resistor.rotate();
      circuit.appendElectronics(resistor);

      result[0][1].connect('bottom', { electronic: resistor, pinName: '1' });
      result[1][1].setElectronic(resistor.id);
      result[2][1].connect('top', { electronic: resistor, pinName: '2' });
      expect(circuit.layout).toMatchObject(result);
    });

    it('performs components pin-to-pin attachment', () => {
      resetCircuitGrid(6, 1);
      const resistor1 = createElectronic(EC.Resistor, { coordinate: [1, 0] });
      circuit.appendElectronics(resistor1);

      const resistor2 = createElectronic(EC.Resistor, { coordinate: [3, 0] });
      circuit.appendElectronics(resistor2);

      result[0][0].connect('right', { electronic: resistor1, pinName: '1' });
      result[0][1].setElectronic(resistor1.id);
      result[0][2].connect('left', { electronic: resistor1, pinName: '2' });
      result[0][2].connect('right', { electronic: resistor2, pinName: '1' });
      result[0][3].setElectronic(resistor2.id);
      result[0][4].connect('left', { electronic: resistor2, pinName: '2' });
      expect(circuit.layout).toMatchObject(result);
    });

    it('performs rotated components pin-to-pin attachment', () => {
      const resistor1 = createElectronic(EC.Resistor, { coordinate: [2, 1] });
      resistor1.rotate();
  
      const resistor2 = createElectronic(EC.Resistor, { coordinate: [3, 2] });
      resistor2.rotate();
      resistor2.rotate();
  
      const resistor3 = createElectronic(EC.Resistor, { coordinate: [2, 3] });
      resistor3.rotate();
      resistor3.rotate();
      resistor3.rotate();
  
      const resistor4 = createElectronic(EC.Resistor, { coordinate: [1, 2] });
      resistor4.rotate();
      resistor4.rotate();
      resistor4.rotate();
      resistor4.rotate();
  
      circuit.appendElectronics(resistor1);
      circuit.appendElectronics(resistor2);
      circuit.appendElectronics(resistor3);
      circuit.appendElectronics(resistor4);
  
      // [ a a n a a ]
      // [ a a o a a ]
      // [ n o n o n ]
      // [ a a o a a ]
      // [ a a n a a ]
      result[0][2].connect('bottom', { electronic: resistor1, pinName: '1' });
      result[1][2].setElectronic(resistor1.id);
      result[2][0].connect('right', { electronic: resistor4, pinName: '1' });
      result[2][1].setElectronic(resistor4.id);
      result[2][2].connect('left', { electronic: resistor4, pinName: '2' });
      result[2][2].connect('top', { electronic: resistor1, pinName: '2' });
      result[2][2].connect('right', { electronic: resistor2, pinName: '2' });
      result[2][2].connect('bottom', { electronic: resistor3, pinName: '2' });
      result[2][3].setElectronic(resistor2.id);
      result[2][4].connect('left', { electronic: resistor2, pinName: '1' });
      result[3][2].setElectronic(resistor3.id);
      result[4][2].connect('top', { electronic: resistor3, pinName: '1' });
      expect(circuit.layout).toMatchObject(result);
    });
  });

  describe('Circuit.addJoint', () => {
    it('wires simple circuit using wire-edges', () => {
      // [ a a a a a ]
      // [ w n o n w ]
      // [ w a a a w ]
      // [ w n o n w ]
      // [ a a a a a ]
      const resistor1 = createElectronic(EC.Resistor, { coordinate: [2, 1] });
      const resistor2 = createElectronic(EC.Resistor, { coordinate: [2, 3] });
      circuit.appendElectronics(resistor1);
      circuit.appendElectronics(resistor2);

      circuit.addJoint([0, 1], [1, 1]);
      circuit.addJoint([3, 1], [4, 1]);
      circuit.addJoint([4, 1], [4, 2]);
      circuit.addJoint([4, 2], [4, 3]);
      circuit.addJoint([4, 3], [3, 3]);
      circuit.addJoint([1, 3], [0, 3]);
      circuit.addJoint([0, 3], [0, 2]);
      circuit.addJoint([0, 2], [0, 1]);

      result[1][0].connect('right', result[1][1]);
      result[1][0].connect('bottom', result[2][0]);
      result[1][1].connect('right', { electronic: resistor1, pinName: '1' });
      result[1][2].setElectronic(resistor1.id);
      result[1][3].connect('left', { electronic: resistor1, pinName: '2' });
      result[1][3].connect('right', result[1][4]);
      result[1][4].connect('bottom', result[2][4]);
      result[2][4].connect('bottom', result[3][4]);
      result[3][4].connect('left', result[3][3]);
      result[3][3].connect('left', { electronic: resistor2, pinName: '2' });
      result[3][2].setElectronic(resistor2.id);
      result[3][1].connect('right', { electronic: resistor2, pinName: '1' });
      result[3][1].connect('left', result[3][0]);
      result[3][0].connect('top', result[2][0]);
      expect(circuit.layout).toMatchObject(result);
    });
  });

  describe('Integration', () => {
    describe('Circuit Creation', () => {
      it('creates simple circuit with mixed electronic components', async () => {
        const example = (await import('../examples/01-simple-circuit')).default;
        const {
          circuit,
          expected: { layout: expected }
        } = example;

        expect(circuit.layout).toMatchObject(expected);
      });  
    });

    describe('Circuit.Graph', () => {
      it('creates graph according to the circuit layout', async () => {
        const examples = (await import('../examples')).default;
        for await (let { default: example } of examples) {
          const { circuit, expected: { graph } } = example;
          const derived = circuit.deriveGraph();

          expect(new Set(derived.edges)).toMatchObject(new Set(graph.edges));
          expect(new Set(derived.nodes)).toMatchObject(new Set(graph.nodes));
        }
      });
    });
  });
});
