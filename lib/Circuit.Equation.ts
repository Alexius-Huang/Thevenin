export default class Equation {  
  public readonly unknowns = new Set<string>();
  public readonly coefficientMap = new Map<string, number>();
  private cacheSolution: { [key: string]: number } | null = null;
  public constantValue: number = 0;

  get with() { return this; }
  get solution() { return this.cacheSolution; }

  public unknown(name: string, coefficient: number = 0) {
    if (this.unknowns.has(name))
      throw new Error(`Already named the unknown as \`${name}\``);
    this.unknowns.add(name);
    this.coefficientMap.set(name, coefficient);
    this.cacheSolution = null;

    return this;
  }

  public constant(value: number) {
    this.constantValue = value;
    this.cacheSolution = null;

    return this;
  }

  public coefficient(name: string, value: number) {
    if (!this.unknowns.has(name))
      throw new Error(`No unknown name as \`${name}\``);
    this.coefficientMap.set(name, value);
    this.cacheSolution = null;

    return this;
  }

  public pluck(): { [key: string]: number } {
    const result: { [key: string]: number } = { constant: this.constantValue };
    this.unknowns.forEach(uk => {
      result[uk] = this.coefficientMap.get(uk) as number;
    });
 
    return result;
  }

  public solve(known: { [key: string]: number } = {}): ({ [key: string]: number }) {
    const count = this.unknowns.size;

    if (count === 0)
      throw new Error('No unknowns need to be solved!');

    if (count === 1) {
      const key = Array.from(this.unknowns)[0];
      const coeff = this.coefficientMap.get(key) as number;
      this.cacheSolution = { [key]: (this.constantValue / coeff) };
    } else {
      const keys = Object.keys(known);
      if (keys.length !== count - 1)
        throw new Error(`Should provide provide ${count - 1} known values in order to solve for the unknown!`);
      
      const clonedUnknowns = new Set<string>(this.unknowns);
      const cm = this.coefficientMap;
      let cumulation = this.constantValue;
      keys.forEach(key => {
        if (cm.has(key)) {
          const knownValue = known[key] as number;
          const coefficient = cm.get(key) as number;
          cumulation -= knownValue * coefficient;
          clonedUnknowns.delete(key);
        } else {
          throw new Error(`\`${key}\` is not defined as an unknown in equation!`);
        }
      });

      const targetUnknown = Array.from(clonedUnknowns)[0];
      const coeff = cm.get(targetUnknown) as number;
      this.cacheSolution = { [targetUnknown]: (cumulation / coeff) };
    }

    return this.cacheSolution;
  }
}
