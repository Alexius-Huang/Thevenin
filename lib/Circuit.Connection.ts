import CircuitUnit from './Circuit.Unit';
import Electronic from './Circuit.Electronic';
import { CurrentFlow } from './Circuit.Graph';

export type Connection = ElectronicUnitConnection | CircuitUnitConnection;

export class CircuitUnitConnection {
  public currentFlow = CurrentFlow.NEUTRAL;
  public current: number = NaN;

  constructor(public unit: CircuitUnit) {}  
}

export class ElectronicUnitConnection {
  public currentFlow = CurrentFlow.NEUTRAL;
  public current: number = NaN;

  constructor(
    public electronic: Electronic,
    public pinName: string,
  ) {}
}
