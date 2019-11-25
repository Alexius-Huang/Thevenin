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

  describe('DC Analysis', () => {
    describe('Nodal Analysis', () => {
    // TODO: Make these general cases
      it('[Single Node Equation] uses Nodal Analysis to model and derive the node voltage and edge current result of the circuit', async () => {
        const example = (await import('../examples/02-linear-series')).default;
        const {
          supernodePropagatedGraph: input,
          nodalAnalyzedGraph: expected,
        } = example.expected;

        const simulation = new Simulation(input);
        simulation.nodalAnalysis();
        const { graph: result } = simulation;

        expect(result.nodes).toMatchObject(expected.nodes);
        expect(result.edges).toMatchObject(expected.edges);

        const example2 = (await import('../examples/05-linear-series-differed-ground-location')).default;
        const {
          supernodePropagatedGraph: input2,
          nodalAnalyzedGraph: expected2,
        } = example2.expected;

        const simulation2 = new Simulation(input2);
        simulation2.nodalAnalysis();
        const { graph: result2 } = simulation2;

        expect(result2.nodes).toMatchObject(expected2.nodes);
        expect(result2.edges).toMatchObject(expected2.edges);
      });

      it('[Multi-Node Equations] uses Nodal Analysis to model and derive the node voltage and edge current result of the circuit using Gaussian Elimination', async () => {
        const example = (await import('../examples/04-linear-mixed')).default;
        const {
          supernodePropagatedGraph: input,
          nodalAnalyzedGraph: expected,
        } = example.expected;

        const simulation = new Simulation(input);
        simulation.nodalAnalysis();
        const { graph: result } = simulation;

        expect(result.nodes).toMatchObject(expected.nodes);
        expect(result.edges).toMatchObject(expected.edges);
      });
    });
  
    describe('DC Propagation', () => {
      it('propagates through the one node/supernode case of circuit and assign electrical infos to the nodes and edges', async () => {
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
        }
      });
    });

    describe('Integration', () => {
      it('[Single Node Equation] uses Nodal Analysis to derive the node-voltage result and then uses DC propagation to derive the current flow result', async () => {
        const example = (await import('../examples/02-linear-series')).default;
        const {
          nodalAnalyzedGraph: input,
          DCPropagatedGraph: expected,
        } = example.expected;

        const simulation = new Simulation(input);
        simulation.DCPropagation();
        const { graph: result } = simulation;

        expect(result.nodes).toMatchObject(expected.nodes);
        expect(result.edges).toMatchObject(expected.edges);

        const example2 = (await import('../examples/05-linear-series-differed-ground-location')).default;
        const {
          supernodePropagatedGraph: input2,
          DCPropagatedGraph: expected2,
        } = example2.expected;

        const simulation2 = new Simulation(input2);
        simulation2.DCPropagation();
        const { graph: result2 } = simulation2;

        expect(result2.nodes).toMatchObject(expected2.nodes);
        expect(result2.edges).toMatchObject(expected2.edges);
      });

      it('[Multi-Node Equations] uses Nodal Analysis to derive the node-voltage result and then uses DC propagation to derive the current flow result', async () => {
        const example3 = (await import('../examples/04-linear-mixed')).default;
        const {
          supernodePropagatedGraph: input3,
          DCPropagatedGraph: expected3,
        } = example3.expected;

        const simulation3 = new Simulation(input3);
        simulation3.DCPropagation();
        const { graph: result3 } = simulation3;

        expect(result3.nodes).toMatchObject(expected3.nodes);
        expect(result3.edges).toMatchObject(expected3.edges);
      });
    });
  });
});
