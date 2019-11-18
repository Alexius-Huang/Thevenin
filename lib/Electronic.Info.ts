export enum ElectronicType {
  Load,
  Source,
  Other,
}

export type ElectronicInfo = {
  type: ElectronicType;
  unit: string | null | 'Unit';
  unitPostfix: string | null | 'unit';
  pins: Set<string>;
}

export default {
  'DC Source': {
    type: ElectronicType.Source,
    unit: 'Volt',
    unitPostfix: 'V',
    pins: new Set(['POSITIVE', 'NEGATIVE']),
  },
  'Ground': {
    type: ElectronicType.Other,
    unit: null,
    unitPostfix: null,
    pins: new Set(['']),
  },
  'Resistor': {
    type: ElectronicType.Load,
    unit: 'Ohms',
    unitPostfix: 'Ω',
    pins: new Set(['1', '2']),
  },
} as { [key: string]: Readonly<ElectronicInfo> };
