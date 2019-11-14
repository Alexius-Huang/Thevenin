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

  constructor(public rows: number, public columns: number) {
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

  public canAttachComponent(e: IElectronic): boolean {
    const { coordinate: [x, y], dimension: d, center: [cx, cy] } = e;

    for (let row = 0; row < d.length; row += 1) {
      for (let col = 0; col < d[row].length; col += 1) {
        const [relX, relY] = [
          x - (cx - col),
          y - (cy - row),
        ];

        const isOutOfBound = (relX < 0 || relY < 0 || relX >= this.columns || relY >= this.rows);
        if (isOutOfBound) return false;

        const nodeType = d[row][col];
        const pinState = this.layout[relY][relX];
        const failed = (
          (nodeType === NT.Pin && pinState === PinState.Occupied)       ||
          (nodeType === NT.Occupied && pinState !== PinState.Available)
        );

        if (failed) return false;
      }
    }

    return true;
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
