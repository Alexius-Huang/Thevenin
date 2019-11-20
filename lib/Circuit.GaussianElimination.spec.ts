import GaussianElimination, { Variable } from './Circuit.GaussianElimination';

describe('Lib: Circuit.GaussianElimination', () => {
  describe('Variables', () => {  
    it('registers different kind of variables', () => {
      const expected = [
        new Variable('x', 0),
        new Variable('y', 1),
        new Variable('z', 2),
      ];

      const ge = new GaussianElimination();
      ge.registerVariable('x');
      ge.registerVariable('y');
      ge.registerVariable('z');

      expect(ge.variables).toMatchObject(expected);
    });
  });

  describe('Equations', () => {
    it.todo('establishes equations whenever variables are registered');
    // it('establishes equations whenever variables are registered', () => {
    //   const expected1 = [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //   ];

    //   const ge = new GaussianElimination();
    //   ge.registerVariable('x');
    //   ge.registerVariable('y');
    //   expect(ge.equations).toMatchObject(expected1);

    //   const expected2 = [
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //   ];
    //   ge.registerVariable('z');
    //   expect(ge.equations).toMatchObject(expected2);
    // });

    it.todo('establishes equations which inserts the variable coefficient right before the last column');
    // it('establishes equations which inserts the variable coefficient right before the last column', () => {
    //   const expected1 = [
    //     [2, 2, 6],
    //     [3, 1, 5],
    //   ];

    //   const expected2 = [
    //     [2, 2, 0, 6],
    //     [3, 1, 0, 5],
    //     [0, 0, 0, 0],
    //   ];
    // });
  });
});
