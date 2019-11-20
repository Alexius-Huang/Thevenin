import Circuit from '../lib/Circuit';
import Electronic from '../lib/Electronic';
import Graph from '../lib/Circuit.Graph';

const files = [
  './01-simple-circuit.ts',
  './02-linear-series.ts',
  './03-linear-parallel.ts',
];

type CircuitExample = {
  circuit: Circuit;
  components: { [key: string]: Electronic },
  expected: {
    graph: Graph;
    supernodePropagatedGraph?: Graph;
  };
};

const importExamples = files.map(path => import(path));

export default importExamples as Array<Promise<{ default: CircuitExample }>>;
