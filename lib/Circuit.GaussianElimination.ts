export class Variable {
  public result: number = NaN;

  constructor(
    public name: string,
    public index: number,
  ) {}
}

export default class GaussianElimination {
  public readonly variables: Array<Variable> = [];
  public readonly equations: Array<Array<number>> = [];

  public registerVariable(name: string) {
    const v = new Variable(name, this.variables.length);
    this.variables.push(v);
  }
}
