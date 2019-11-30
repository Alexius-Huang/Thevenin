import Circuit from '../lib/Circuit';
import Electronic from '../lib/Circuit.Electronic';
import Graph from '../lib/Circuit.Graph';
import CircuitUnit from '../lib/Circuit.Unit';

const files = [
  './01-simple-circuit.ts',
  './02-linear-series.ts',
  './03-linear-parallel.ts',
  './04-linear-mixed.ts',
  './05-linear-series-differed-ground-location.ts',
  './06-wheatstone-bridge.ts',
];

type CircuitExample = {
  circuit: Circuit;
  components: { [key: string]: Electronic },
  expected: {
    layout: Array<Array<CircuitUnit>>;
    graph: Graph;
    supernodePropagatedGraph: Graph;
    nodalAnalyzedGraph?: Graph;
    DCPropagatedGraph: Graph;
    mappedLayout: Array<Array<CircuitUnit>>;
  };
};

const importExamples: Array<Promise<{ default: CircuitExample }>> =
  files.map(path => import(path));

export default importExamples;
