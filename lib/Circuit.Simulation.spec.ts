import Simulation from './Circuit.Simulation';

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

  describe('DC Propagation', () => {
    it('propagates through the circuit and assign electrical infos to the nodes and edges', async () => {
      const examples = (await import('../examples')).directDCPropagationExamples;
      for await (let { default: example } of examples) {
        const {
          supernodePropagatedGraph: input,
          DCPropagatedGraph: expected,
        } = example.expected;
  
        const simulation = new Simulation(input);
        simulation.DCPropagation();
        const { graph: result } = simulation;
  
        expect(result.nodes).toMatchObject(expected.nodes);
        expect(result.edges).toMatchObject(expected.edges);
        expect(true).toBe(true);  
      }
    });
  });
});
