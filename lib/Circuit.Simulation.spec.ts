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
    it.todo('propagates through the circuit and assign electrical infos to the nodes and edges');
    // it('propagates through the circuit and assign electrical infos to the nodes and edges', () => {});
  });
});
