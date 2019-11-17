import { IElectronic } from './Electronic';
import Unit, { CircuitUnitType } from './Circuit.Unit';
import { ElectronicUnitType } from './Electronic.Unit';

export default class Circuit {
  public electronics: Array<IElectronic> = [];
  public layout: Array<Array<Unit>>;

  constructor(public rows: number, public columns: number) {
    this.layout = Array.from(Array(rows)).map(() =>
      Array.from(Array(columns)).map(() => new Unit())
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
        const cu = this.layout[relY][relX];
        const cuType = cu.type;
        const eu = d[row][col];

        if (eu.type === ElectronicUnitType.Pin) {
          const direction = eu.circuitConnectDirection;

          if (cuType === CircuitUnitType.Available) {
            cu.connect(direction);
          } else if (cuType === CircuitUnitType.HorizontallyAvailable) {

          } else if (cuType === CircuitUnitType.VerticallyAvailable) {

          } else if (cuType === CircuitUnitType.PartiallyAvailable) {

          } else if (cuType === CircuitUnitType.Occupied) {
            throw new Error(`Electronic Connection Error`);
          }
        } else if (eu.type === ElectronicUnitType.Occupied) {
          if (cuType === CircuitUnitType.Available) {
            cu.isLocked = true;
          } else {
            throw new Error(`Electronic Connection Error`);
          }
        } else {
          throw new Error(`Electronic Unit type ${ElectronicUnitType[eu.type]} isn't declared`);
        }
      }
    }

    this.electronics.push(e);
  }

  // public canAttachComponent(e: IElectronic): boolean {
  //   const { coordinate: [x, y], dimension: d, center: [cx, cy] } = e;

  //   for (let row = 0; row < d.length; row += 1) {
  //     for (let col = 0; col < d[row].length; col += 1) {
  //       const [relX, relY] = [
  //         x - (cx - col),
  //         y - (cy - row),
  //       ];

  //       const isOutOfBound = (relX < 0 || relY < 0 || relX >= this.columns || relY >= this.rows);
  //       if (isOutOfBound) return false;

  //       const nodeType = d[row][col];
  //       const relCircuitUnitType = this.layout[relY][relX].state;

  //       const failed = (
  //         relCircuitUnitType === CircuitUnitType.Occupied
  //         // (nodeType === ElectronicUnit.Pin && CircuitUnitType === CircuitUnitType.Occupied) ||
  //         // (nodeType === ElectronicUnit.Occupied && CircuitUnitType !== CircuitUnitType.Available)
  //       );

  //       if (failed) return false;
  //     }
  //   }

  //   return true;
  // }
};
