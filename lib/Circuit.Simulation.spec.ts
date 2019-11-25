/**
 * @jest-environment node
 */
import Simulation from './Circuit.Simulation';
import Graph from './Circuit.Graph';

describe('Lib: Circuit.Simulation', () => {
  describe('Supernode Propagation', () => {
    it('creates supernode whenever linked to the DCSource edge', async () => {
      const examples = (await import('../examples')).default;
      for await (let { default: example } of examples) {
        const {
          graph: input,
          supernodePropagatedGraph: expected,
        } = example.expected;

        const simulation = new Simulation(input);
        simulation.supernodePropagation();
        const { graph: result } = simulation;

        expect(result.nodes).toMatchObject(expected.nodes);
        expect(result.edges).toMatchObject(expected.edges);
      }
    });
  });

  describe('DC Analysis', () => {
    describe('Nodal Analysis', () => {
      it('uses Nodal Analysis to model and derive the node voltage and edge current result of the circuit', async () => {
        const examples = (await import('../examples')).default;
        for await (let { default: example } of examples) {
          const {
            supernodePropagatedGraph: input,
            nodalAnalyzedGraph: expected,
          } = example.expected;

          if (expected === undefined) {
            if (input.nodes.size !== 1)
              throw new Error('Test example should have nodalAnalyzedGraph provided!');
          } else {
            const simulation = new Simulation(input);
            simulation.nodalAnalysis();
            const { graph: result } = simulation;
    
            expect(result.nodes).toMatchObject(expected.nodes);
            expect(result.edges).toMatchObject(expected.edges);  
          }
        }
      });
    });
  
    describe('DC Propagation', () => {
      it('propagates through the one node/supernode case of circuit and assign electrical infos to the nodes and edges', async () => {
        const examples = (await import('../examples')).default;
        for await (let { default: example } of examples) {
          const graph = example.expected.supernodePropagatedGraph;
          const expected = example.expected.DCPropagatedGraph;
          let input: Graph;

          if (graph.nodes.size > 1) {
            input = example.expected.nodalAnalyzedGraph as Graph;
          } else {
            input = graph;
          }

          const simulation = new Simulation(input);
          simulation.DCPropagation();
          const { graph: result } = simulation;
    
          expect(result.nodes).toMatchObject(expected.nodes);
          expect(result.edges).toMatchObject(expected.edges);
        }
      });
    });
  });
});
