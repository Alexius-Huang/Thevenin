import { Edge } from '../Circuit.Graph';
import { Ground } from './Ground';
import { Resistor } from './Resistor';

export default {
  'Ground': { ...Ground },
  'Resistor': { ...Resistor },
} as {
  [key: string]: {
    deriveCurrent: (edge: Edge) => boolean;
  }
};
