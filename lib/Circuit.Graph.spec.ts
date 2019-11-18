import CircuitGraph from './Circuit.Graph';
import { EC, createElectronic } from './Electronic';

describe('Lib: Circuit.Graph', () => {
  describe('Initialization', () => {
    it.todo('generates simple graph of circuit'
    // , () => {
      // [ a a a a a ] R: resistor
      // [ a n R n a ] S: DC Source
      // [ a S a w a ] G: Ground
      // [ a n n w a ]
      // [ a a G a a ]
      // const resistor = createElectronic(EC.Resistor, { coordinate: [2, 1] });
      // const source = createElectronic(EC.DCSource, { coordinate : [1, 2]});
      // source.rotate();
      // const ground = createElectronic(EC.Ground, { coordinate: [2, 4] });

      // const graph = new CircuitGraph();
      // graph.addNode(resistor.id);
      // graph.addNode(source.id);
      // graph.addNode(ground.id);

      // graph.addEdge(resistor.id, source.id);
      // graph.addEdge(resistor.id, ground.id);
      // graph.addEdge(source.id, ground.id);
    // }
    );
  });
});
