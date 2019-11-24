import Equation from './Circuit.Equation';

describe('Lib: Circuit.Equation', () => {
  describe('Equation Establishment', () => {
    it('sets up simple equation with one variable', () => {
      const eq = new Equation();
      eq.unknown('x');
      eq.coefficient('x', 3);
      eq.constant(6);

      expect(eq.unknowns).toMatchObject(new Set(['x']));
      expect(eq.coefficientMap).toMatchObject(new Map<string, number>([
        ['x', 3],
      ]));
      expect(eq.solution).toBe(null);
      
      eq.solve();
      expect(eq.solution).toMatchObject({ 'x': 2 });

      eq.coefficient('x', 6);
      expect(eq.solution).toBe(null);

      eq.solve();
      expect(eq.solution).toMatchObject({ 'x': 1 });
    });

    it('allows chained expressions using the `with` preposition', () => {
      const eq = new Equation();
      eq.with
        .unknown('x')
        .coefficient('x', 3)
        .constant(6);

      expect(eq.unknowns).toMatchObject(new Set(['x']));
      expect(eq.solution).toBe(null);

      eq.solve();
      expect(eq.solution).toMatchObject({ 'x': 2 });
    });

    it('allows shorthanded coefficient assignment when adding new unknown', () => {
      const eq = new Equation();
      eq.with
        .unknown('x', 3)
        .constant(-6);

      eq.solve();
      expect(eq.solution).toMatchObject({ 'x': -2 });
    });
  });

  describe('Multi-unknowns Equation', () => {
    let sampleEq: Equation;
    beforeEach(() => {
      sampleEq = new Equation();
      sampleEq
        .with.unknown('x', 1)
        .with.unknown('y', 2)
        .with.constant(6);
    });

    it('sets up multi-unknowns equation with more than one variable', () => {
      expect(sampleEq.unknowns).toMatchObject(new Set(['x', 'y']));
      expect(sampleEq.coefficientMap).toMatchObject(new Map<string, number>([
        ['x', 1],
        ['y', 2],
      ]));
    });

    it('throws error when two or more unknown is required to solve simultaneously without providing sufficient known solution', () => {
      expect(() => sampleEq.solve()).toThrowError(
        'Should provide provide 1 known values in order to solve for the unknown!'
      );
    });

    it('throws error when providing wrong unknown name in the solution object to solve the equation', () => {
      expect(() => sampleEq.solve({ 'z': 1 })).toThrowError(
        '`z` is not defined as an unknown in equation!'
      );
    });

    it('solves the unknown providing with different kind of known solutions', () => {
      sampleEq.solve({ 'x': 2 });
      expect(sampleEq.solution).toMatchObject({ 'y': 2 });

      sampleEq.solve({ 'y': 4 });
      expect(sampleEq.solution).toMatchObject({ 'x': -2 });
    });

    it('solves the unknown providing with more known solutions', () => {
      const eq = new Equation();

      eq.with.unknown('x', 3)
        .with.unknown('y', -2)
        .with.unknown('z', 5)
        .with.constant(-3);

      eq.solve({ 'x': 1, 'y': 2 });
      expect(eq.solution).toMatchObject({ 'z': -0.4 });

      eq.solve({ 'z': 3, 'x': 3 });
      expect(eq.solution).toMatchObject({ 'y': 13.5 });

      eq.solve({ 'y': 3, 'z': 1 });
      expect(eq.solution).toMatchObject({ 'x': -2/3 });
    });
  });

  describe('Edge Case', () => {
    it('throws error when no knowns in the equation to-be solved', () => {
      expect(() => new Equation().solve()).toThrowError(
        'No unknowns need to be solved!'
      );
    });
  });
});
