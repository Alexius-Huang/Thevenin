import Simulation from './Circuit.Simulation';

describe('Lib: Circuit.Simulation', () => {
  describe('Supernode Propagation', () => {
    it('creates supernode whenever linked to the DCSource edge', async () => {
      const examples = (await import('../examples')).default;
      for await (let { default: example } of examples) {
        const {
          graph: input,
          supernodePropagatedGraph: output,
        } = example.expected;

        const simulation = new Simulation(input);
        simulation.supernodePropagation();
        const { graph: result } = simulation;

        expect(output.nodes).toMatchObject(result.nodes);
        expect(output.edges).toMatchObject(result.edges);
      }
    });
  });
});
