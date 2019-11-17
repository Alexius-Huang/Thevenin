import { IElectronic } from './Electronic';
import Unit, { CircuitUnitType } from './Circuit.Unit';
import { ElectronicUnitType } from './Electronic.Unit';

export default class Circuit {
  public electronics: Array<IElectronic> = [];
  public layout: Array<Array<Unit>>;

  constructor(public columns: number, public rows: number) {
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
        const eu = d[row][col];

        if (eu.type === ElectronicUnitType.Pin) {
          cu.connect(eu.circuitConnectDirection);
        } else if (eu.type === ElectronicUnitType.Occupied) {
          cu.setOccupied();
        } else {
          throw new Error(`Electronic Unit type ${ElectronicUnitType[eu.type]} isn't declared`);
        }
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

        const eu = d[row][col];
        const cu = this.layout[relY][relX];

        if (
          // Circuit unit is already occupied then isn't available
          cu.type === CircuitUnitType.Occupied ||

          // Circuit unit isn't available but perhaps partially available
          cu.type !== CircuitUnitType.Available && (
            // Electronic unit should occupy then cannot accept non-available circuit unit
            eu.type === ElectronicUnitType.Occupied ||

            // Electronic unit is pin since is isn't occupied
            // but isn't connectable to the circuit
            !cu.isDirectionConnectable(eu.circuitConnectDirection)
          )
        ) return false;
      }
    }

    return true;
  }
};
