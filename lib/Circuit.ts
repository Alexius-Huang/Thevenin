import { IElectronic, NT } from './Electronic';

export enum PinState {
  Available,
  Pin,
  Crossed,
  Intersected,
  Occupied,
}

export default class Circuit {
  public electronics: Array<IElectronic> = [];
  public layout: Array<Array<PinState>>;

  constructor(rows: number, columns: number) {
    this.layout = Array.from(Array(rows)).map(() =>
      Array.from(Array(columns)).map(() => PinState.Available)
    );
  }

  public appendElectronics(e: IElectronic) {
    const { coordinate: [x, y], dimension: d, center: [cx, cy] } = e;
    for (let row = 0; row < d.length; row += 1) {
      for (let col = 0; col < d[row].length; col += 1) {
        const [relX, relY] = [
          x - (cx - col),
          y - (cy - row),
        ];

        const nodeType = d[row][col];
        this.assignPinState(nodeType).to([relX, relY]);
      }
    }

    this.electronics.push(e);
  }

  private assignPinState = (nt: NT) => ({
    to: ([relX, relY]: [number, number]) => {
      if (nt === NT.Pin) {
        this.layout[relY][relX] = PinState.Pin;
      } else if (nt === NT.Occupied) {
        this.layout[relY][relX] = PinState.Occupied;
      }
    }
  });
};
