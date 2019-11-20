export class Variable {
  public result: number = NaN;

  constructor(
    public name: string,
    public index: number,
  ) {}
}

export default class GaussianElimination {
  public readonly variables: Array<Variable> = [];
  public readonly matrix: Array<Array<number>> = [];

  public registerVariable(name: string) {
    const v = new Variable(name, this.variables.length);
    this.variables.push(v);

    const countOfVars = this.variables.length;
    this.matrix.push(Array(countOfVars + 1).fill(0));

    for (let i = 0; i < countOfVars - 1; i += 1) {
      this.matrix[i].push(0, this.matrix[i].pop() as number);
    }
  }
}
