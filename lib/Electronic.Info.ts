export enum ElectronicType {
  Load,
  Source,
  Other,
}

export type ElectronicInfo = {
  type: ElectronicType;
  unit: string | null | 'Unit';
  unitPostfix: string | null | 'unit';
}

export default {
  'DC Source': {
    type: ElectronicType.Source,
    unit: 'Volt',
    unitPostfix: 'V',
  },  
  'Ground': {
    type: ElectronicType.Other,
    unit: null,
    unitPostfix: null,
  },
  'Resistor': {
    type: ElectronicType.Load,
    unit: 'Ohms',
    unitPostfix: 'Ω',
  },
} as { [key: string]: Readonly<ElectronicInfo> };
