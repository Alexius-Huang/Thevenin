import CircuitUnit from './Circuit.Unit';
import Electronic from './Electronic';

export type Connection = ElectronicUnitConnection | CircuitUnitConnection;

export class CircuitUnitConnection {
  constructor(public unit: CircuitUnit) {}  
}

export class ElectronicUnitConnection {
  constructor(
    public electronic: Electronic,
    public pinName: string,
  ) {}
}
