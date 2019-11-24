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
      expect(ge.variableNameColumnMap).toMatchObject(new Map<string, number>([
        ['x', 0],
        ['y', 1],
        ['z', 2]
      ]));
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
      const testCases: Array<{
        variableResultMap: Array<[string, number]>;
        matrix: Array<Array<number>>
      }> = [
        {
          variableResultMap: [
            ['x', 1], ['y', 2]
          ],
          matrix: [
            [1, 3, 7],
            [2, 2, 6],
          ]
        },
        {
          variableResultMap: [
            ['x', 1], ['y', 2], ['z', 1]
          ],
          matrix: [
            [1, 1, 2,  5],
            [2, 5, 4, 16],
            [3, 4, 1, 12],
          ]
        },
        {
          variableResultMap: [
            ['a', 3], ['b', 2], ['c', 4], ['d', 2], ['e', 1]
          ],
          matrix: [
            [1, 2, 3, 4, 5, 32],
            [2, 1, 1, 3, 1, 19],
            [4, 1, 2, 4, 6, 36],
            [2, 2, 2, 1, 3, 23],
            [4, 5, 2, 1, 2, 34],
          ],
        },
        {
          variableResultMap: [
            ['a', 1], ['b', 1], ['c', 1], ['d', 1], ['e', 1], ['f', 1], ['g', 1], ['h', 1], ['i', 1], ['j', 1]
          ],
          matrix: [
            [ 3,  2,  3, 4, 5, -1,  7,  2,  3,  4,  32],
            [ 2, -1,  3, 3, 1,  1,  0,  3, -3,  2,  11],
            [-3,  4,  6, 1, 7, -3, 10,  2,  3,  1,  28],
            [ 1,  1,  1, 2, 3,  1,  3,  4,  5,  1,  22],
            [-2, -1,  2, 3, 1,  4,  4,  5,  6,  4,  26],
            [ 1,  1,  1, 1, 1,  1,  1,  1,  1,  1,  10],
            [ 1,  2,  3, 4, 5,  6,  7,  8,  9, 10,  55],
            [ 1,  1,  2, 3, 5,  8, 13, 21, 34, 55, 143],
            [ 3,  4,  2, 1, 3,  4,  5,  6,  7,  1,  36],
            [-3, -2, -3, 4, 0,  1,  3, -2,  4, 77,  79],
          ],
        },
      ];

      testCases.forEach(({ variableResultMap: vrm, matrix: m }) => {
        const ge = new GaussianElimination();
        const expected = vrm.map(([name, result], i) => {
          ge.registerVariable(name);

          const v = new Variable(name, i);
          v.result = result;
          return v;
        });

        m.forEach((row, rowIndex) => row.forEach((col, colIndex) => {
          ge.matrix[rowIndex][colIndex] = col;
        }));

        expect(ge.solve()).toMatchObject(expected);
      });
    });
  });
});
