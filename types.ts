
export enum ComponentType {
  // Sources
  VoltageSource = 'VOLTAGE_SOURCE',
  ACSource = 'AC_SOURCE',
  Ground = 'GROUND',
  
  // Passive
  Resistor = 'RESISTOR',
  Potentiometer = 'POTENTIOMETER',
  Capacitor = 'CAPACITOR',
  
  // Active/Semiconductors
  TransistorNPN = 'TRANSISTOR_NPN',
  TransistorPNP = 'TRANSISTOR_PNP',
  LED = 'LED',
  Diode = 'DIODE',
  ZenerDiode = 'ZENER_DIODE',
  IC555 = 'IC_555',
  
  // Electromechanical
  Switch = 'SWITCH',
  
  // Logic
  ANDGate = 'AND_GATE',
  ORGate = 'OR_GATE',
  NOTGate = 'NOT_GATE',
  NANDGate = 'NAND_GATE',
  NORGate = 'NOR_GATE',
  XORGate = 'XOR_GATE',
  
  // Integrated Circuits
  Microcontroller = 'MICROCONTROLLER',
  
  // Tools
  Multimeter = 'MULTIMETER'
}

export interface Point {
  x: number;
  y: number;
}

export interface Pin {
  id: string; // relative ID, e.g., "p1"
  x: number; // relative to component center
  y: number;
  type: 'input' | 'output' | 'passive';
}

export interface ComponentData {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  properties: Record<string, any>;
}

export interface Wire {
  id: string;
  fromCompId: string;
  fromPinId: string;
  toCompId: string;
  toPinId: string;
  waypoints?: Point[]; // Manual path points
}

export type ResistorBandColor = 
  | 'black' | 'brown' | 'red' | 'orange' | 'yellow' 
  | 'green' | 'blue' | 'violet' | 'gray' | 'white' | 'gold' | 'silver';

export interface LabState {
  components: ComponentData[];
  wires: Wire[];
  selection: string | null; // Component ID
  isSimulating: boolean;
  voltageSetting: number; // For the variable supply
}
