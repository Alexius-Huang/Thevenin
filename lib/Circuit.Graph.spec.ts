import CircuitGraph, { Node, Edge } from './Circuit.Graph';
import { EC, createElectronic } from './Electronic';

describe('Lib: Circuit.Graph', () => {
  describe('Initialization', () => {
    it('generates simple graph of circuit', () => {
      // [ a  a  a  a  a ] R: resistor
      // [ a +n  R  n  a ] S: DC Source
      // [ a  S  a  w  a ] G: Ground
      // [ a -n  n  w  a ]
      // [ a  a  G  a  a ]
      const resistor = createElectronic(EC.Resistor, { coordinate: [2, 1] });
      const source = createElectronic(EC.DCSource, { coordinate : [1, 2]});
      source.rotate();
      const ground = createElectronic(EC.Ground, { coordinate: [2, 4] });

      const graph = new CircuitGraph();
      const n1 = graph.createNode(resistor);
      const n2 = graph.createNode(source);
      const n3 = graph.createNode(ground);

      const e1 = graph.createEdge();
      n1.connect(e1, '1');
      n2.connect(e1, 'POSITIVE');

      const e2 = graph.createEdge();
      n1.connect(e2, '2');
      n2.connect(e2, 'NEGATIVE');
      n3.connect(e2);

      expect(graph.nodes.length).toBe(3);
      expect(graph.edges.length).toBe(2);

      expect(n1.pinsMap).toMatchObject(new Map<string, Edge | null>([
        ['1', e1],
        ['2', e2],
      ]));
      expect(n2.pinsMap).toMatchObject(new Map<string, Edge | null>([
        ['POSITIVE', e1],
        ['NEGATIVE', e2],
      ]));
      expect(n3.pinsMap).toMatchObject(new Map<string, Edge | null>([
        ['', e2],
      ]));

      expect(e1.nodes).toMatchObject(new Set<{ node: Node, pinMeta: string }>([
        { node: n1, pinMeta: '1' },
        { node: n2, pinMeta: 'POSITIVE' },
      ]));
      expect(e2.nodes).toMatchObject(new Set<{ node: Node, pinMeta: string }>([
        { node: n1, pinMeta: '2' },
        { node: n2, pinMeta: 'NEGATIVE' },
        { node: n3, pinMeta: '' },
      ]));
    });
  });
});
