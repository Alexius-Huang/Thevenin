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
          .toThrowError('1 equation(s) to solve for 2 unknowns is impossible!');
        expect(() => new SimultaneousEquations([eq21]).solve())
          .toThrowError('1 equation(s) to solve for 3 unknowns is impossible!');
        expect(() => new SimultaneousEquations([eq21, eq23]).solve())
          .toThrowError('2 equation(s) to solve for 3 unknowns is impossible!');
      });

      it('throws error when there are too much equations provided to be solve', () => {
        const eq13 = new Equation();
        eq13.unknown('x').unknown('y').constant(0);
        expect(() => new SimultaneousEquations([eq11, eq12, eq13]).solve())
          .toThrowError('3 equation(s) to solve for 2 unknowns is impossible!');
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
      let eq1: Equation, eq2: Equation;
      beforeAll(() => {
        [eq1, eq2] = Array.from(Array(2)).map(() => new Equation());
        eq1.unknown('x', 1).unknown('y', -1).unknown('z', 4).constant(15);
        eq2.unknown('x', 2).unknown('y', 1).unknown('z', -1).constant(-3);
      });

      it('provided known values aren\'t matching the name of the unknowns in simultaneous equations', () => {
        const se1 = new SimultaneousEquations([eq1]);
        expect(() => se1.solve({ 'x': 1, 'w': 3 }))
          .toThrowError('`w` is not defined as an unknown in simultaneous equations!');
        expect(() => se1.solve({ 'w': 1, 'a': 3 }))
          .toThrowError('`w` is not defined as an unknown in simultaneous equations!');

        const se2 = new SimultaneousEquations([eq1, eq2]);
        expect(() => se2.solve({ 'a': 1 }))
          .toThrowError('`a` is not defined as an unknown in simultaneous equations!');
      });

      it('provided known values still not enough to solve the simultaneous equations', () => {
        const se1 = new SimultaneousEquations([eq1]);
        expect(() => se1.solve({ 'x': 1 }))
          .toThrowError('1 equation(s) with 1 known value(s) to solve for 2 unknowns is impossible!');
      });
    });
  });

  describe('Equations with Linear Dependency', () => {
    describe('Circuit.SimultaneousEquations#eliminateLinearDependency', () => {
      let eq1: Equation, eq2: Equation;
      let ldeq11: Equation, ldeq21: Equation, ldeq22: Equation;
      beforeAll(() => {
        [eq1, eq2, ldeq11, ldeq21, ldeq22] = Array.from(Array(5)).map(() => new Equation());
        eq1.unknown('x', 2).unknown('y', 3).constant(7);
        eq2.unknown('x', -1).unknown('y', 3).constant(1);

        ldeq11.unknown('x', 6).unknown('y', 9).constant(21);
        ldeq21.unknown('x', 0.5).unknown('y', -1.5).constant(-0.5);
        ldeq22.unknown('x', -4).unknown('y', 12).constant(4);
      });

      it('removes the linearly dependent equations', () => {
        const se = new SimultaneousEquations([eq1, eq2, ldeq11, ldeq21, ldeq22]);
        se.eliminateLinearDependency();

        expect(se.equations.size).toBe(2);
        expect(se.equations.has(eq1)).toBe(true);
        expect(se.equations.has(ldeq11)).toBe(false);
        expect(se.equations.has(eq2)).toBe(true);
        expect(se.equations.has(ldeq21)).toBe(false);
        expect(se.equations.has(ldeq22)).toBe(false);
        expect(se.solve()).toMatchObject({ 'x': 2, 'y': 1 });
      });
    });
  });
});
