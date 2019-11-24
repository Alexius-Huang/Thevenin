import Equation from './Circuit.Equation';

export default class SimultaneousEquations {
  public readonly unknowns = new Set<string>();
  public readonly equations = new Set<Equation>();

  constructor(equations: Array<Equation> = []) {
    equations.forEach(eq => this.addEquation(eq));
  }

  public addEquation(eq: Equation) {
    if (eq.unknowns.size < 2)
      throw new Error('Equation to be included into Simultaneous Equations should contain at least two unknowns');

    if (this.equations.size === 0) {
      this.equations.add(eq);
      eq.unknowns.forEach(uk => {
        this.unknowns.add(uk);
      });
      return;
    }

    if (this.unknowns.size !== eq.unknowns.size)
      throw new Error('The quantity of unknown is unmatched among the equations set');

    this.unknowns.forEach(uk => {
      if (!eq.unknowns.has(uk))
        throw new Error('Name of the unknown is unmatched among the equations set');
    });

    this.equations.add(eq);
  }
}
