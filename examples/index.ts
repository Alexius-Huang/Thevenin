import Circuit from '../lib/Circuit';
import Electronic from '../lib/Electronic';
import Graph from '../lib/Circuit.Graph';

const files = [
  './01-simple-circuit.ts',
  './02-linear-series.ts',
  './03-linear-parallel.ts',
  './04-linear-mixed.ts',
  './05-linear-series-differed-ground-location.ts',
];

type CircuitExample = {
  circuit: Circuit;
  components: { [key: string]: Electronic },
  expected: {
    graph: Graph;
    supernodePropagatedGraph: Graph;
    nodalAnalyzedGraph?: Graph;
    DCPropagatedGraph?: Graph;
  };
};

const importExamples: Array<Promise<{ default: CircuitExample }>> =
  files.map(path => import(path));

export default importExamples;

/* Specifically for Direct DC propagation tests */
type DirectDCPropagationExample = {
  circuit: Circuit;
  components: { [key: string]: Electronic },
  expected: {
    graph: Graph;
    supernodePropagatedGraph: Graph;
    DCPropagatedGraph: Graph;
  };
}

const directDCPropagationFiles = [
  './01-simple-circuit.ts',
  './03-linear-parallel.ts',
];

export const directDCPropagationExamples: Array<Promise<{ default: DirectDCPropagationExample }>> =
  directDCPropagationFiles.map(path => import(path));
