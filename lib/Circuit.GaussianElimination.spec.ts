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

  describe('Matrix', () => {
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
});
