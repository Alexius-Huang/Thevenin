import { round } from './Circuit.Util';

export class Variable {
  public result: number = NaN;

  constructor(
    public name: string,
    public column: number,
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

  public solve(precision: number = 1e6): Array<Variable> {
    const { matrix, variables: vars } = this;
    const m = matrix.map(arr => arr.map(v => v));
    const countOfVars = vars.length;

    /* Lower Triangularization */
    for (let row = 0; row < m.length - 1; row += 1) {
      for (let targetRow = row + 1; targetRow < m.length; targetRow += 1) {
        const multipler = m[targetRow][row] / m[row][row];

        for (let col = row; col <= countOfVars; col += 1) {
          m[targetRow][col] -= m[row][col] * multipler;
        }
      }
    }

    /* Bottom-to-Top Propagated Solution */
    for (let row = countOfVars - 1; row >= 0; row -= 1) {
      for (let solvedColumnIndex = countOfVars - 1; solvedColumnIndex > row; solvedColumnIndex -= 1) {
        const coefficient = m[row][solvedColumnIndex];
        m[row][countOfVars] -= coefficient * vars[solvedColumnIndex].result;
      }

      vars[row].result = round(m[row][countOfVars] / m[row][row], precision);
    }

    return this.variables;
  }
}
