import Simulation from './Circuit.Simulation';
import { EC } from './Electronic';

describe.only('Lib: Circuit.Simulation', () => {
  describe('Supernode Propagation', () => {
    it('creates supernode whenever linked to the DCSource edge', async () => {
      const example = (await import('../examples/01-simple-circuit')).default;
      const {
        graph: input,
        supernodePropagatedGraph: output,
      } = example.expected;

      const simulation = new Simulation(input);
      simulation.supernodePropagation();
      const { graph: result } = simulation;

      expect(output).toMatchObject(result);
    });
  });
});
