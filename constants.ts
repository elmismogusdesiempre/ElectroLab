
import { ComponentType, Pin, ResistorBandColor } from './types';

export const GRID_SIZE = 20;

// --- Translations ---
export const TRANSLATIONS = {
    en: {
        title: "ElectroLab AI",
        presets: "Presets",
        aiTutor: "AI Tutor",
        loadCircuit: "Load Circuit",
        voltageSource: "DC Voltage",
        stopSim: "STOP SIMULATION",
        startSim: "START SIMULATION",
        addMultimeter: "Add Multimeter",
        ledColor: "LED Color",
        capacitorSettings: "Capacitor Settings",
        acSourceSettings: "AC Source Settings",
        potentiometerSettings: "Potentiometer Settings",
        multimeterSettings: "Multimeter Settings",
        ic555Pinout: "IC 555 Pinout",
        size: "Size",
        standard: "Standard",
        large: "Large (2x)",
        peakVoltage: "Peak Voltage (V)",
        frequency: "Frequency (Hz)",
        wiperPosition: "Wiper Position (%)",
        totalResistance: "Total Resistance (Ω)",
        electrolytic: "Electrolytic (Polarized)",
        ceramic: "Ceramic / Electrostatic",
        capacitance: "Capacitance (µF)",
        safetyAlert: {
            title: "SAFETY ALERT",
            shortCircuit: "Short Circuit Detected!",
            shortCircuitMsg: "You have connected the voltage source terminals directly without a load. This causes infinite current, which damages the power supply and wires.",
            ohmError: "Multimeter Misuse!",
            ohmErrorMsg: "Never use an Ohmmeter on an energized circuit. It injects current to measure resistance, and external voltage will damage the internal fuse or the device."
        },
        colors: {
            red: "Red",
            green: "Green",
            blue: "Blue",
            yellow: "Yellow",
            orange: "Orange",
            white: "White"
        },
        categories: {
            sources: "Sources",
            passive: "Passive",
            semicon: "Semiconductors",
            logic: "Logic Gates",
            io: "Input / Output",
            tools: "Tools"
        },
        components: {
            resistor: "Resistor",
            potentiometer: "Potentiometer",
            capacitor: "Capacitor",
            led: "LED",
            diode: "Rectifier Diode",
            zener: "Zener Diode",
            dcSource: "DC Source",
            acSource: "AC Source",
            ground: "Ground",
            switch: "Switch",
            transistorNPN: "NPN Transistor",
            transistorPNP: "PNP Transistor",
            and: "AND Gate",
            or: "OR Gate",
            not: "NOT Gate",
            nand: "NAND Gate",
            nor: "NOR Gate",
            xor: "XOR Gate",
            mcu: "MCU",
            multimeter: "Multimeter",
            ic555: "555 Timer"
        }
    },
    es: {
        title: "ElectroLab IA",
        presets: "Ejemplos",
        aiTutor: "Tutor IA",
        loadCircuit: "Cargar Circuito",
        voltageSource: "Voltaje DC",
        stopSim: "DETENER SIMULACIÓN",
        startSim: "INICIAR SIMULACIÓN",
        addMultimeter: "Añadir Tester",
        ledColor: "Color del LED",
        capacitorSettings: "Configuración Condensador",
        acSourceSettings: "Configuración Fuente AC",
        potentiometerSettings: "Ajuste Potenciómetro",
        multimeterSettings: "Configuración Multímetro",
        ic555Pinout: "Pinout IC 555",
        size: "Tamaño",
        standard: "Estándar",
        large: "Grande (2x)",
        peakVoltage: "Voltaje Pico (V)",
        frequency: "Frecuencia (Hz)",
        wiperPosition: "Posición Cursor (%)",
        totalResistance: "Resistencia Total (Ω)",
        electrolytic: "Electrolítico (Polarizado)",
        ceramic: "Cerámico / Electrostático",
        capacitance: "Capacitancia (µF)",
        safetyAlert: {
            title: "ALERTA DE SEGURIDAD",
            shortCircuit: "¡Cortocircuito Detectado!",
            shortCircuitMsg: "Has conectado los terminales de la fuente directamente sin carga. Esto causa una corriente infinita que daña la fuente y los cables.",
            ohmError: "¡Mal Uso del Multímetro!",
            ohmErrorMsg: "Nunca uses el Ohmímetro en un circuito energizado. Este modo inyecta corriente para medir, y el voltaje externo dañará el fusible interno o el dispositivo."
        },
        colors: {
            red: "Rojo",
            green: "Verde",
            blue: "Azul",
            yellow: "Amarillo",
            orange: "Naranja",
            white: "Blanco"
        },
        categories: {
            sources: "Fuentes",
            passive: "Pasivos",
            semicon: "Semiconductores",
            logic: "Lógica",
            io: "Entrada / Salida",
            tools: "Herramientas"
        },
        components: {
            resistor: "Resistencia",
            potentiometer: "Potenciómetro",
            capacitor: "Condensador",
            led: "LED",
            diode: "Diodo Rectificador",
            zener: "Diodo Zener",
            dcSource: "Fuente DC",
            acSource: "Fuente AC",
            ground: "Tierra (GND)",
            switch: "Interruptor",
            transistorNPN: "Transistor NPN",
            transistorPNP: "Transistor PNP",
            and: "Compuerta AND",
            or: "Compuerta OR",
            not: "Compuerta NOT",
            nand: "Compuerta NAND",
            nor: "Compuerta NOR",
            xor: "Compuerta XOR",
            mcu: "Microcontrolador",
            multimeter: "Multímetro",
            ic555: "Temporizador 555"
        }
    }
};

export const COMPONENT_PINS: Record<ComponentType, Pin[]> = {
  [ComponentType.Resistor]: [
    { id: 'p1', x: -40, y: 0, type: 'passive' },
    { id: 'p2', x: 40, y: 0, type: 'passive' }
  ],
  [ComponentType.Potentiometer]: [
    { id: 'p1', x: -40, y: 10, type: 'passive' },
    { id: 'p2', x: 40, y: 10, type: 'passive' },
    { id: 'wiper', x: 0, y: -20, type: 'passive' }
  ],
  [ComponentType.Capacitor]: [
    { id: 'p1', x: -20, y: 0, type: 'passive' },
    { id: 'p2', x: 20, y: 0, type: 'passive' }
  ],
  [ComponentType.LED]: [
    { id: 'anode', x: -20, y: 0, type: 'passive' },
    { id: 'cathode', x: 20, y: 0, type: 'passive' }
  ],
  [ComponentType.Diode]: [
    { id: 'anode', x: -20, y: 0, type: 'passive' },
    { id: 'cathode', x: 20, y: 0, type: 'passive' }
  ],
  [ComponentType.ZenerDiode]: [
    { id: 'anode', x: -20, y: 0, type: 'passive' },
    { id: 'cathode', x: 20, y: 0, type: 'passive' }
  ],
  [ComponentType.TransistorNPN]: [
    { id: 'c', x: 20, y: -20, type: 'passive' }, // Collector
    { id: 'b', x: -20, y: 0, type: 'input' },    // Base
    { id: 'e', x: 20, y: 20, type: 'passive' }   // Emitter
  ],
  [ComponentType.TransistorPNP]: [
    { id: 'c', x: 20, y: -20, type: 'passive' },
    { id: 'b', x: -20, y: 0, type: 'input' },
    { id: 'e', x: 20, y: 20, type: 'passive' }
  ],
  [ComponentType.VoltageSource]: [
    { id: 'pos', x: 0, y: -30, type: 'output' },
    { id: 'neg', x: 0, y: 30, type: 'passive' }
  ],
  [ComponentType.ACSource]: [
    { id: 'p1', x: 0, y: -30, type: 'passive' },
    { id: 'p2', x: 0, y: 30, type: 'passive' }
  ],
  [ComponentType.Ground]: [
    { id: 'gnd', x: 0, y: -20, type: 'passive' }
  ],
  [ComponentType.Switch]: [
    { id: 'in', x: -30, y: 0, type: 'passive' },
    { id: 'out', x: 30, y: 0, type: 'passive' }
  ],
  [ComponentType.ANDGate]: [
    { id: 'in1', x: -40, y: -15, type: 'input' },
    { id: 'in2', x: -40, y: 15, type: 'input' },
    { id: 'out', x: 40, y: 0, type: 'output' }
  ],
  [ComponentType.ORGate]: [
    { id: 'in1', x: -40, y: -15, type: 'input' },
    { id: 'in2', x: -40, y: 15, type: 'input' },
    { id: 'out', x: 40, y: 0, type: 'output' }
  ],
  [ComponentType.NOTGate]: [
    { id: 'in', x: -40, y: 0, type: 'input' },
    { id: 'out', x: 40, y: 0, type: 'output' }
  ],
  [ComponentType.NANDGate]: [
    { id: 'in1', x: -40, y: -15, type: 'input' },
    { id: 'in2', x: -40, y: 15, type: 'input' },
    { id: 'out', x: 40, y: 0, type: 'output' }
  ],
  [ComponentType.NORGate]: [
    { id: 'in1', x: -40, y: -15, type: 'input' },
    { id: 'in2', x: -40, y: 15, type: 'input' },
    { id: 'out', x: 40, y: 0, type: 'output' }
  ],
  [ComponentType.XORGate]: [
    { id: 'in1', x: -40, y: -15, type: 'input' },
    { id: 'in2', x: -40, y: 15, type: 'input' },
    { id: 'out', x: 40, y: 0, type: 'output' }
  ],
  [ComponentType.Microcontroller]: [
    { id: 'vcc', x: -30, y: -50, type: 'passive' },
    { id: 'gnd', x: -30, y: 50, type: 'passive' },
    { id: 'p0', x: 30, y: -40, type: 'output' },
    { id: 'p1', x: 30, y: -20, type: 'output' },
    { id: 'p2', x: 30, y: 0, type: 'input' },
    { id: 'p3', x: 30, y: 20, type: 'input' }
  ],
  [ComponentType.Multimeter]: [
    { id: 'red', x: -30, y: 30, type: 'input' },
    { id: 'black', x: 30, y: 30, type: 'input' }
  ],
  [ComponentType.IC555]: [
      // Left Side (Top to Bottom) - Widened to +/- 60 to allow visual legs
      { id: 'gnd', x: -60, y: -30, type: 'passive' }, // Pin 1
      { id: 'trig', x: -60, y: -10, type: 'input' },  // Pin 2
      { id: 'out', x: -60, y: 10, type: 'output' },   // Pin 3
      { id: 'rst', x: -60, y: 30, type: 'input' },    // Pin 4
      
      // Right Side (Bottom to Top)
      { id: 'vcc', x: 60, y: -30, type: 'passive' },  // Pin 8
      { id: 'dis', x: 60, y: -10, type: 'passive' },  // Pin 7
      { id: 'thr', x: 60, y: 10, type: 'input' },     // Pin 6
      { id: 'ctrl', x: 60, y: 30, type: 'input' }     // Pin 5
  ]
};

export const COMPONENT_INFO: Record<ComponentType, { title: string; description: string; tips: string }> = {
    [ComponentType.Resistor]: {
        title: "Resistor",
        description: "Limits electrical current flow.",
        tips: "Non-polarized. Edit bands to change value."
    },
    [ComponentType.Potentiometer]: {
        title: "Potentiometer",
        description: "Variable resistor with three terminals.",
        tips: "Use as a voltage divider or variable resistance."
    },
    [ComponentType.Capacitor]: {
        title: "Capacitor",
        description: "Stores energy in an electric field. Blocks DC.",
        tips: "Use for filtering or timing circuits."
    },
    [ComponentType.LED]: {
        title: "LED",
        description: "Light Emitting Diode.",
        tips: "Polarized. Needs a resistor to limit current."
    },
    [ComponentType.Diode]: {
        title: "Rectifier Diode",
        description: "Allows current to flow in one direction only.",
        tips: "Anode (+), Cathode (-). 0.7V drop."
    },
    [ComponentType.ZenerDiode]: {
        title: "Zener Diode",
        description: "Allows flow in reverse when voltage exceeds breakdown.",
        tips: "Used for voltage regulation."
    },
    [ComponentType.TransistorNPN]: {
        title: "NPN Transistor",
        description: "BJT Transistor. Current flows C to E when Base is High.",
        tips: "Active switch/amplifier."
    },
    [ComponentType.TransistorPNP]: {
        title: "PNP Transistor",
        description: "BJT Transistor. Current flows E to C when Base is Low.",
        tips: "Active switch/amplifier."
    },
    [ComponentType.VoltageSource]: {
        title: "DC Source",
        description: "Provides constant voltage.",
        tips: "Set voltage in the bottom panel."
    },
    [ComponentType.ACSource]: {
        title: "AC Source",
        description: "Provides alternating current voltage.",
        tips: "Sine wave output."
    },
    [ComponentType.Ground]: {
        title: "Ground (GND)",
        description: "0V Reference.",
        tips: "Required for simulation."
    },
    [ComponentType.Switch]: {
        title: "Switch",
        description: "Mechanically connects/disconnects.",
        tips: "Double click to toggle."
    },
    [ComponentType.ANDGate]: {
        title: "AND Gate",
        description: "Output HIGH if ALL inputs HIGH.",
        tips: "Digital logic."
    },
    [ComponentType.ORGate]: {
        title: "OR Gate",
        description: "Output HIGH if ANY input HIGH.",
        tips: "Digital logic."
    },
    [ComponentType.NOTGate]: {
        title: "NOT Gate",
        description: "Inverts input signal.",
        tips: "High -> Low, Low -> High."
    },
    [ComponentType.NANDGate]: {
        title: "NAND Gate",
        description: "AND followed by NOT. Output LOW only if ALL inputs HIGH.",
        tips: "Universal gate."
    },
    [ComponentType.NORGate]: {
        title: "NOR Gate",
        description: "OR followed by NOT. Output LOW if ANY input HIGH.",
        tips: "Universal gate."
    },
    [ComponentType.XORGate]: {
        title: "XOR Gate",
        description: "Exclusive OR. Output HIGH if inputs are different.",
        tips: "Used in adders."
    },
    [ComponentType.Microcontroller]: {
        title: "Microcontroller",
        description: "Programmable logic unit.",
        tips: "Requires VCC and GND."
    },
    [ComponentType.Multimeter]: {
        title: "Multimeter",
        description: "Measure Voltage or Resistance.",
        tips: "Double click to change mode."
    },
    [ComponentType.IC555]: {
        title: "555 Timer",
        description: "Integrated circuit used for timing, pulse generation, and oscillation.",
        tips: "Click settings to see Pinout."
    }
};

export const BAND_COLORS: Record<ResistorBandColor, string> = {
  black: '#000000',
  brown: '#8B4513',
  red: '#FF0000',
  orange: '#FFA500',
  yellow: '#FFFF00',
  green: '#008000',
  blue: '#0000FF',
  violet: '#EE82EE',
  gray: '#808080',
  white: '#FFFFFF',
  gold: '#FFD700',
  silver: '#C0C0C0'
};

export const BAND_VALUES: Record<string, number> = {
  black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
  green: 5, blue: 6, violet: 7, gray: 8, white: 9
};

export const MULTIPLIER_VALUES: Record<string, number> = {
  black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000,
  green: 100000, blue: 1000000, violet: 10000000, gold: 0.1, silver: 0.01
};
