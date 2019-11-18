export enum ElectronicType {
  Load,
  Source,
  Other,
}

export type ElectronicInfo = {
  type: ElectronicType;
  unit: string;
  unitPostfix: string;
}

export default {
  'Resistor': {
    type: ElectronicType.Load,
    unit: 'Ohms',
    unitPostfix: 'Ω',
  }, 
  'DC Source': {
    type: ElectronicType.Source,
    unit: 'Volt',
    unitPostfix: 'V',
  },
} as { [key: string]: Readonly<ElectronicInfo> };
