import Circuit from './Circuit';

describe('Lib: Circuit', () => {
  it ('creates a circuit instance', () => {
    const circuit = new Circuit();

    expect(circuit.electronics).toMatchObject([]);
  });
});
