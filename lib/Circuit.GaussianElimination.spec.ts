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

  describe('Matrix Data Structure', () => {
    it('establishes new rows and columns of matrix whenever variables are registered', () => {
      const expected1 = [
        [0, 0, 0],
        [0, 0, 0],
      ];

      const ge = new GaussianElimination();
      ge.registerVariable('x');
      ge.registerVariable('y');
      expect(ge.matrix).toMatchObject(expected1);

      const expected2 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      ge.registerVariable('z');
      expect(ge.matrix).toMatchObject(expected2);
    });

    it('establishes matrix which inserts the variable coefficient right before the last column', () => {
      const expected1 = [
        [2, 2, 6],
        [3, 1, 5],
      ];

      const ge = new GaussianElimination();
      ge.registerVariable('x');
      ge.registerVariable('y');
      ge.matrix[0][0] = 2;
      ge.matrix[0][1] = 2;
      ge.matrix[0][2] = 6;
      ge.matrix[1][0] = 3;
      ge.matrix[1][1] = 1;
      ge.matrix[1][2] = 5;
      expect(ge.matrix).toMatchObject(expected1);

      ge.registerVariable('z');
      const expected2 = [
        [2, 2, 0, 6],
        [3, 1, 0, 5],
        [0, 0, 0, 0],
      ];
      expect(ge.matrix).toMatchObject(expected2);
    });
  });

  describe('Solution', () => {
    it('solves multi-dimensional matrix using Gaussian Elimination method and assign the result to variables', () => {
      const expected = [
        new Variable('x', 0),
        new Variable('y', 1),
        new Variable('z', 2),
      ];
      expected[0].result = 1;
      expected[1].result = 2;
      expected[2].result = 1;

      const ge = new GaussianElimination();
      ge.registerVariable('x');
      ge.registerVariable('y');
      ge.registerVariable('z');
      ge.matrix[0][0] = 1;
      ge.matrix[0][1] = 1;
      ge.matrix[0][2] = 2;
      ge.matrix[0][3] = 5;
      ge.matrix[1][0] = 2;
      ge.matrix[1][1] = 5;
      ge.matrix[1][2] = 4;
      ge.matrix[1][3] = 16;
      ge.matrix[2][0] = 3;
      ge.matrix[2][1] = 4;
      ge.matrix[2][2] = 1;
      ge.matrix[2][3] = 12;
      expect(ge.solve()).toMatchObject(expected);
    });
  });
});
