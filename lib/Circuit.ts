import { IElectronic, Coordinate } from './Electronic';
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

  public addJoint(c1: Coordinate, c2: Coordinate) {
    let [[col1, row1], [col2, row2]] = [c1, c2];
    const [deltaCol, deltaRow] = [col2 - col1, row2 - row1];

    if (Math.abs(deltaCol) === 1 && deltaRow === 0) {
      if (deltaCol > 0) {
        this.layout[row1][col1].connect('right');
        this.layout[row2][col2].connect('left');
      } else {
        this.layout[row1][col1].connect('left');
        this.layout[row2][col2].connect('right');
      }
    } else if (Math.abs(deltaRow) === 1 && deltaCol === 0) {
      if (deltaRow > 0) {
        this.layout[row1][col1].connect('bottom');
        this.layout[row2][col2].connect('top');
      } else {
        this.layout[row1][col1].connect('top');
        this.layout[row2][col2].connect('bottom');
      }
    } else {
      throw new Error('Invalid circuit joint connection!');
    }
  }

  public appendElectronics(e: IElectronic) {
    const { coordinate: [x, y], dimension: d, center: [cx, cy], id } = e;

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
          cu.setElectronic(id);
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
          cu.type === CircuitUnitType.Electronic ||
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
