/**
 * @jest-environment node
 */
import Simulation from './Circuit.Simulation';

describe('Lib: Circuit.Simulation', () => {
  describe('Reference Point Validation', () => {
    describe('Circuit.Simulation#hasReferencePoint', () => {
      it.todo('returns true if circuit graph contains the Ground electronic component');
    });
  });

  describe('Supernode Propagation', () => {
    it('creates supernode whenever linked to the DCSource edge', async () => {
      const examples = (await import('../examples')).default;
      for await (let { default: example } of examples) {
        const {
          circuit,
          expected: { supernodePropagatedGraph: expected },
        } = example;

        const simulation = new Simulation(circuit.deriveGraph());
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
            circuit,
            expected: {
              nodalAnalyzedGraph: expected,
            }
          } = example;

          const simulation = new Simulation(circuit.deriveGraph());
          simulation.supernodePropagation();

          if (expected === undefined) {
            if (simulation.graph.nodes.size !== 1)
              throw new Error('Test example should have nodalAnalyzedGraph provided!');
          } else {
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
          const {
            circuit,
            expected: { DCPropagatedGraph: expected }
          } = example;

          const sim = new Simulation(circuit.deriveGraph());
          sim.supernodePropagation();
          sim.nodalAnalysis();
          sim.DCPropagation();

          const { graph: result } = sim;
          expect(result.nodes).toMatchObject(expected.nodes);
          expect(result.edges).toMatchObject(expected.edges);
        }
      });
    });
  });
});
