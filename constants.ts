
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
        
        // Editor Titles
        ledColor: "LED Color",
        capacitorSettings: "Capacitor Settings",
        acSourceSettings: "AC Source Settings",
        potentiometerSettings: "Potentiometer Settings",
        multimeterSettings: "Multimeter Settings",
        resistorBuilder: "Resistor Builder",
        
        // Resistor Editor
        bands4: "4 BANDS",
        bands5: "5 BANDS",
        band1: "1st Digit",
        band2: "2nd Digit",
        band3: "3rd Digit",
        multiplier: "Multiplier",
        tolerance: "Tolerance",
        bandGeneric: "Band",

        // Pinouts
        ic555Pinout: "IC 555 Pinout",
        pinDesc: {
            gnd: "Ground (0V)",
            trig: "Trigger (Sets Output High if < 1/3 Vcc)",
            out: "Output Voltage",
            rst: "Active Low Reset",
            vcc: "Supply Voltage (+)",
            dis: "Discharge (Shorts to Ground when Output Low)",
            thr: "Threshold (Sets Output Low if > 2/3 Vcc)",
            ctrl: "Control Voltage (Internally 2/3 Vcc)"
        },

        // AI
        aiIntro: "Hello! I am your AI Lab Assistant.\n\nAsk me about the current circuit, or tell me to build something (e.g., 'Build a high pass filter').",
        askAiPlaceholder: "Ask AI...",
        aiError: "Error connecting to AI service.",

        // Common
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

        // Editor Titles
        ledColor: "Color del LED",
        capacitorSettings: "Configuración Condensador",
        acSourceSettings: "Configuración Fuente AC",
        potentiometerSettings: "Ajuste Potenciómetro",
        multimeterSettings: "Configuración Multímetro",
        resistorBuilder: "Editor de Resistencia",

        // Resistor Editor
        bands4: "4 BANDAS",
        bands5: "5 BANDAS",
        band1: "1er Dígito",
        band2: "2do Dígito",
        band3: "3er Dígito",
        multiplier: "Multiplicador",
        tolerance: "Tolerancia",
        bandGeneric: "Banda",

        // Pinouts
        ic555Pinout: "Pinout IC 555",
        pinDesc: {
            gnd: "Tierra / Masa (0V)",
            trig: "Disparo (Salida Alta si < 1/3 Vcc)",
            out: "Voltaje de Salida",
            rst: "Reset (Activo en Bajo)",
            vcc: "Voltaje de Alimentación (+)",
            dis: "Descarga (A Tierra si Salida es Baja)",
            thr: "Umbral (Salida Baja si > 2/3 Vcc)",
            ctrl: "Voltaje de Control (2/3 Vcc)"
        },

        // AI
        aiIntro: "¡Hola! Soy tu asistente de laboratorio.\n\nPregúntame sobre el circuito actual o pídeme que construya algo (ej. 'Crea un filtro paso alto').",
        askAiPlaceholder: "Preguntar a la IA...",
        aiError: "Error al conectar con el servicio de IA.",

        // Common
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
      { id: 'gnd', x: -60, y: -30, type: 'passive' }, 
      { id: 'trig', x: -60, y: -10, type: 'input' },  
      { id: 'out', x: -60, y: 10, type: 'output' },   
      { id: 'rst', x: -60, y: 30, type: 'input' },    
      { id: 'vcc', x: 60, y: -30, type: 'passive' },  
      { id: 'dis', x: 60, y: -10, type: 'passive' },  
      { id: 'thr', x: 60, y: 10, type: 'input' },     
      { id: 'ctrl', x: 60, y: 30, type: 'input' }     
  ]
};

// Helper function to get component info in current language
export const getComponentInfo = (type: ComponentType, lang: 'en' | 'es') => {
    const isEs = lang === 'es';
    const infos: Record<ComponentType, { title: string; description: string; tips: string }> = {
        [ComponentType.Resistor]: {
            title: isEs ? "Resistencia" : "Resistor",
            description: isEs ? "Limita el flujo de corriente eléctrica." : "Limits electrical current flow.",
            tips: isEs ? "No polarizado. Edita las bandas para cambiar valor." : "Non-polarized. Edit bands to change value."
        },
        [ComponentType.Potentiometer]: {
            title: isEs ? "Potenciómetro" : "Potentiometer",
            description: isEs ? "Resistencia variable con tres terminales." : "Variable resistor with three terminals.",
            tips: isEs ? "Úsalo como divisor de voltaje o resistencia variable." : "Use as a voltage divider or variable resistance."
        },
        [ComponentType.Capacitor]: {
            title: isEs ? "Condensador" : "Capacitor",
            description: isEs ? "Almacena energía en campo eléctrico. Bloquea DC." : "Stores energy in an electric field. Blocks DC.",
            tips: isEs ? "Para filtrado o temporización." : "Use for filtering or timing circuits."
        },
        [ComponentType.LED]: {
            title: "LED",
            description: isEs ? "Diodo Emisor de Luz." : "Light Emitting Diode.",
            tips: isEs ? "Polarizado. Necesita resistencia limitadora." : "Polarized. Needs a resistor to limit current."
        },
        [ComponentType.Diode]: {
            title: isEs ? "Diodo Rectificador" : "Rectifier Diode",
            description: isEs ? "Permite flujo de corriente en una sola dirección." : "Allows current to flow in one direction only.",
            tips: isEs ? "Ánodo (+), Cátodo (-). Caída ~0.7V." : "Anode (+), Cathode (-). 0.7V drop."
        },
        [ComponentType.ZenerDiode]: {
            title: isEs ? "Diodo Zener" : "Zener Diode",
            description: isEs ? "Permite flujo inverso sobre voltaje de ruptura." : "Allows flow in reverse when voltage exceeds breakdown.",
            tips: isEs ? "Usado para regulación de voltaje." : "Used for voltage regulation."
        },
        [ComponentType.TransistorNPN]: {
            title: isEs ? "Transistor NPN" : "NPN Transistor",
            description: isEs ? "Corriente fluye C a E cuando Base es Alta." : "BJT Transistor. Current flows C to E when Base is High.",
            tips: isEs ? "Interruptor activo/amplificador." : "Active switch/amplifier."
        },
        [ComponentType.TransistorPNP]: {
            title: isEs ? "Transistor PNP" : "PNP Transistor",
            description: isEs ? "Corriente fluye E a C cuando Base es Baja." : "BJT Transistor. Current flows E to C when Base is Low.",
            tips: isEs ? "Interruptor activo/amplificador." : "Active switch/amplifier."
        },
        [ComponentType.VoltageSource]: {
            title: isEs ? "Fuente DC" : "DC Source",
            description: isEs ? "Provee voltaje constante." : "Provides constant voltage.",
            tips: isEs ? "Ajusta voltaje en barra superior." : "Set voltage in top toolbar."
        },
        [ComponentType.ACSource]: {
            title: isEs ? "Fuente AC" : "AC Source",
            description: isEs ? "Provee voltaje de corriente alterna." : "Provides alternating current voltage.",
            tips: isEs ? "Onda senoidal." : "Sine wave output."
        },
        [ComponentType.Ground]: {
            title: isEs ? "Tierra (GND)" : "Ground (GND)",
            description: isEs ? "Referencia 0V." : "0V Reference.",
            tips: isEs ? "Requerido para simulación." : "Required for simulation."
        },
        [ComponentType.Switch]: {
            title: isEs ? "Interruptor" : "Switch",
            description: isEs ? "Conecta/desconecta mecánicamente." : "Mechanically connects/disconnects.",
            tips: isEs ? "Doble clic para alternar." : "Double click to toggle."
        },
        [ComponentType.ANDGate]: {
            title: isEs ? "Compuerta AND" : "AND Gate",
            description: isEs ? "Salida ALTA si TODAS las entradas son ALTAS." : "Output HIGH if ALL inputs HIGH.",
            tips: isEs ? "Lógica digital." : "Digital logic."
        },
        [ComponentType.ORGate]: {
            title: isEs ? "Compuerta OR" : "OR Gate",
            description: isEs ? "Salida ALTA si CUALQUIER entrada es ALTA." : "Output HIGH if ANY input HIGH.",
            tips: isEs ? "Lógica digital." : "Digital logic."
        },
        [ComponentType.NOTGate]: {
            title: isEs ? "Compuerta NOT" : "NOT Gate",
            description: isEs ? "Invierte señal de entrada." : "Inverts input signal.",
            tips: "High -> Low, Low -> High."
        },
        [ComponentType.NANDGate]: {
            title: isEs ? "Compuerta NAND" : "NAND Gate",
            description: isEs ? "AND seguido de NOT. Baja solo si TODAS son ALTAS." : "AND followed by NOT. Output LOW only if ALL inputs HIGH.",
            tips: isEs ? "Compuerta universal." : "Universal gate."
        },
        [ComponentType.NORGate]: {
            title: isEs ? "Compuerta NOR" : "NOR Gate",
            description: isEs ? "OR seguido de NOT. Baja si CUALQUIERA es ALTA." : "OR followed by NOT. Output LOW if ANY input HIGH.",
            tips: isEs ? "Compuerta universal." : "Universal gate."
        },
        [ComponentType.XORGate]: {
            title: isEs ? "Compuerta XOR" : "XOR Gate",
            description: isEs ? "Salida ALTA si entradas son DIFERENTES." : "Exclusive OR. Output HIGH if inputs are different.",
            tips: isEs ? "Usado en sumadores." : "Used in adders."
        },
        [ComponentType.Microcontroller]: {
            title: isEs ? "Microcontrolador" : "Microcontroller",
            description: isEs ? "Unidad lógica programable." : "Programmable logic unit.",
            tips: isEs ? "Requiere VCC y GND." : "Requires VCC and GND."
        },
        [ComponentType.Multimeter]: {
            title: isEs ? "Multímetro" : "Multimeter",
            description: isEs ? "Mide Voltaje, Corriente o Resistencia." : "Measure Voltage, Current or Resistance.",
            tips: isEs ? "Doble clic cambia modo." : "Double click to change mode."
        },
        [ComponentType.IC555]: {
            title: isEs ? "Temporizador 555" : "555 Timer",
            description: isEs ? "Circuito integrado para temporización y oscilación." : "Integrated circuit used for timing, pulse generation, and oscillation.",
            tips: isEs ? "Clic en ajustes para ver Pinout." : "Click settings to see Pinout."
        }
    };
    return infos[type];
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
