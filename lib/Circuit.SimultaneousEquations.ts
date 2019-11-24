import Equation from './Circuit.Equation';
import GaussianElimination from './Circuit.GaussianElimination';

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

  public solve(knownObj: { [key: string]: number } = {}): { [key: string]: number } {
    const countOfEquations = this.equations.size;
    const countOfUnknowns = this.unknowns.size;

    const knowns = Object.keys(knownObj);
    const countOfKnowns = knowns.length;
    if (countOfEquations !== countOfUnknowns - countOfKnowns)
      if (countOfKnowns === 0)
        throw new Error(`${countOfEquations} equation(s) to solve for ${countOfUnknowns} unknowns is impossible!`);
      else
        throw new Error(`${countOfEquations} equation(s) with ${countOfKnowns} known value(s) to solve for ${countOfUnknowns - countOfKnowns} unknowns is impossible!`);

    /* Validate known object */
    knowns.forEach(key => {
      if (!this.unknowns.has(key))
        throw new Error(`\`${key}\` is not defined as an unknown in simultaneous equations!`);
    });

    // Directly solved by original Equation provided mechanism
    if (countOfUnknowns - countOfKnowns === 1)
      return Array.from(this.equations)[0].solve(knownObj);

    const ge = new GaussianElimination();
    const restUnknownArr = Array.from(this.unknowns).filter(uk => knowns.indexOf(uk) === -1)
    const restUnknowns = new Set(restUnknownArr);
    restUnknownArr.forEach(ruk => ge.registerVariable(ruk));

    Array.from(this.equations).forEach((eq, i) => {
      let cumulation = eq.constantValue;

      Array.from(this.unknowns).forEach(uk => {
        const coeff = eq.coefficientMap.get(uk) as number;

        if (restUnknowns.has(uk))
          ge.assignCoefficient({
            equationIndex: i,
            variableName: uk,
            value: coeff,
          });
        else
          cumulation -= coeff * knownObj[uk];
      });

      ge.assignCoefficient({
        equationIndex: i,
        variableName: 'constant',
        value: cumulation,
      });
    });  

    return ge.solve().reduce((obj, v) => Object.assign(obj, { [v.name]: v.result }), {});
  }
}
