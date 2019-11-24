import SimultaneousEquations from './Circuit.SimultaneousEquations';
import Equation from './Circuit.Equation';

describe('Lib: Circuit.SimultaneousEquations', () => {
  describe('Simultaneous Equations Establishment', () => {
    let eq1: Equation, eq2: Equation, eqUnmatched1: Equation, eqUnmatched2: Equation, eqUnmatched3: Equation;
    beforeAll(() => {
      [eq1, eq2, eqUnmatched1, eqUnmatched2, eqUnmatched3] = Array.from(Array(5)).map(() => new Equation());
      eq1.unknown('x', 3).unknown('y', -2).constant(-9);
      eq2.unknown('x', 1).unknown('y', 1).constant(7);
      eqUnmatched1.unknown('x', 1).unknown('z', 1).constant(7);
      eqUnmatched2.unknown('x', 1).unknown('y', 1).unknown('z', 123).constant(7);
      eqUnmatched3.unknown('x', 1).constant(7);
    });

    it('initializes simultaneous equations by array of equations', () => {
      const se = new SimultaneousEquations([eq1, eq2]);
      expect(se.unknowns).toMatchObject(new Set<string>(['x', 'y']));
      expect(se.equations).toMatchObject(new Set<Equation>([eq1, eq2]));
    });

    it('throws error when there are unmatched unknown in array of equations', () => {
      expect(() => new SimultaneousEquations([eq1, eqUnmatched1]))
        .toThrowError('Name of the unknown is unmatched among the equations set');

      expect(() => new SimultaneousEquations([eq1, eqUnmatched2]))
        .toThrowError('The quantity of unknown is unmatched among the equations set');
    });

    it('throws error when adding equations less than 2 unknowns', () => {
      const msg = 'Equation to be included into Simultaneous Equations should contain at least two unknowns';
      expect(() => new SimultaneousEquations([new Equation()])).toThrowError(msg);
      expect(() => new SimultaneousEquations([eqUnmatched3])).toThrowError(msg);
    });

    it('establishes simultaneous equations by adding multiple equations', () => {
      const se = new SimultaneousEquations();
      se.addEquation(eq1);
      se.addEquation(eq2);

      expect(se.unknowns).toMatchObject(new Set<string>(['x', 'y']));
      expect(se.equations).toMatchObject(new Set<Equation>([eq1, eq2]));
    });

    it('throws error when adding unmatched unknown equations', () => {
      const se = new SimultaneousEquations();
      se.addEquation(eq1);
      se.addEquation(eq2);

      expect(() => se.addEquation(eqUnmatched1))
        .toThrowError('Name of the unknown is unmatched among the equations set');
      expect(() => se.addEquation(eqUnmatched2))
        .toThrowError('The quantity of unknown is unmatched among the equations set');
      expect(() => se.addEquation(eqUnmatched3))
        .toThrowError('Equation to be included into Simultaneous Equations should contain at least two unknowns');
    });
  });

  describe('Simultaneous Equations Solution', () => {
    describe('Same Amount of Equations and Unknowns', () => {
      let eq11: Equation, eq12: Equation;
      let eq21: Equation, eq22: Equation, eq23: Equation;
      beforeAll(() => {
        [eq11, eq12, eq21, eq22, eq23] = Array.from(Array(5)).map(() => new Equation());
        eq11.unknown('x', 3).unknown('y', -2).constant(-9);
        eq12.unknown('x', 1).unknown('y', 1).constant(7);
  
        eq21.unknown('x', 1).unknown('y', -1).unknown('z', 4).constant(15);
        eq22.unknown('x', 2).unknown('y', 1).unknown('z', -1).constant(-3);
        eq23.unknown('x', -1).unknown('y', -2).unknown('z', 3).constant(12);
      });
  
      it('solves the simultaneous equations when there are sufficient requirements', () => {
        expect(new SimultaneousEquations([eq11, eq12]).solve()).toMatchObject({ 'x': 1, 'y': 6 });
        expect(new SimultaneousEquations([eq21, eq22, eq23]).solve()).toMatchObject({ 'x': 1, 'y': -2, 'z': 3 });
      });
  
      it('throws error when there aren\'t enough equations to solve', () => {
        expect(() => new SimultaneousEquations([eq11]).solve())
          .toThrowError('Only 1 equation(s) to solve for 2 unknowns is impossible!');
        expect(() => new SimultaneousEquations([eq21]).solve())
          .toThrowError('Only 1 equation(s) to solve for 3 unknowns is impossible!');
        expect(() => new SimultaneousEquations([eq21, eq23]).solve())
          .toThrowError('Only 2 equation(s) to solve for 3 unknowns is impossible!');
      });
    });

    describe('Equations Provides Known Values', () => {
      let eq11: Equation;
      let eq21: Equation, eq22: Equation;
      beforeAll(() => {
        [eq11, eq21, eq22] = Array.from(Array(3)).map(() => new Equation());
        eq11.unknown('x', 3).unknown('y', 2).constant(10);

        eq21.unknown('x', 1).unknown('y', -1).unknown('z', 4).constant(15);
        eq22.unknown('x', 2).unknown('y', 1).unknown('z', -1).constant(-3);
      });

      it('solves the nth-simultaneous equations with provided n-1 known values where n > 1', () => {
        const se1 = new SimultaneousEquations([eq11]);
        expect(se1.solve({ 'x': 2 })).toMatchObject({ 'y': 2 });
        expect(se1.solve({ 'y': 3 })).toMatchObject({ 'x': 4/3 });

        const se2 = new SimultaneousEquations([eq21]);
        expect(se2.solve({ 'x': 1, 'y': 3 })).toMatchObject({ 'z': 4.25 });
        expect(se2.solve({ 'z': 3, 'x': 2 })).toMatchObject({ 'y': -1 });
        expect(se2.solve({ 'y': 2, 'z': 1 })).toMatchObject({ 'x': 13 });
      });

      it('solves the nth-simultaneous equations with provided less than n-1 known values where n > 2', () => {
        const se2 = new SimultaneousEquations([eq21, eq22]);
        expect(se2.solve({ 'x': 1 })).toMatchObject({ 'y': -2, 'z': 3 });
        expect(se2.solve({ 'y': -2 })).toMatchObject({ 'x': 1, 'z': 3 });
        expect(se2.solve({ 'z': 3 })).toMatchObject({ 'y': -2, 'x': 1 });
      });
    });

    describe('Throws Error When...', () => {
      it.todo('provided known values aren\'t matching the name of the unknowns in simultaneous equations');
      it.todo('provided known values still not enough to solve the simultaneous equations');  
    });
  });

  describe('Linear Dependent', () => {
    describe('Circuit.SimultaneousEquations#hasLinearlyDependentEquations', () => {
      it.todo('returns true if detected linearly dependent equations');
    });

    describe('Circuit.SimultaneousEquations#simplify', () => {
      it.todo('simplifys the equations by removing one of the equations in linearly dependent equation pairs (or more)');
    });
  });
});
