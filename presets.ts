
import { ComponentType, ComponentData, Wire } from './types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  components: ComponentData[];
  wires: Wire[];
}

// Helper to keep definitions clean
const c = (id: string, type: ComponentType, x: number, y: number, rotation: number = 0, props: any = {}): ComponentData => ({
  id, type, x, y, rotation, properties: props
});

const w = (id: string, from: string, fromPin: string, to: string, toPin: string): Wire => ({
  id, fromCompId: from, fromPinId: fromPin, toCompId: to, toPinId: toPin
});

export const getPresets = (lang: 'en' | 'es'): Preset[] => {
  const isEs = lang === 'es';
  
  return [
  // --- BASICS ---
  {
    id: 'basic-led',
    name: isEs ? '1. Circuito LED Básico' : '1. Basic LED Circuit',
    description: isEs 
        ? "El 'Hola Mundo' de la electrónica. Demuestra lo mínimo para encender un LED: Fuente DC y Resistencia limitadora. El LED solo enciende si el circuito está cerrado." 
        : "The 'Hello World' of electronics. This circuit demonstrates the minimal requirements to light an LED safely. It uses a DC Voltage Source to provide power, and a Resistor to limit the current flowing through the LED.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('res', ComponentType.Resistor, 300, 300, 0, { bands: ['red', 'red', 'brown', 'gold'] }), // 220 Ohm
      c('led', ComponentType.LED, 500, 300),
      c('gnd', ComponentType.Ground, 100, 400)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'res', 'p1'),
      w('w2', 'res', 'p2', 'led', 'anode'),
      w('w3', 'led', 'cathode', 'gnd', 'gnd'),
      w('w4', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: 'series-resistors',
    name: isEs ? '2. Resistencias en Serie' : '2. Series Resistors',
    description: isEs
        ? "Ley de Voltaje de Kirchhoff. En serie, la corriente es constante, pero el voltaje cae en cada componente. R_total = R1 + R2."
        : "Demonstrates Kirchhoff's Voltage Law. In a series circuit, current is constant throughout, but voltage drops across each component. The total resistance is the sum of all individual resistors (R_total = R1 + R2).",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('r1', ComponentType.Resistor, 250, 270, 0, { bands: ['brown', 'black', 'red', 'gold'] }), // 1k
      c('r2', ComponentType.Resistor, 400, 270, 0, { bands: ['brown', 'black', 'red', 'gold'] }), // 1k
      c('led', ComponentType.LED, 550, 300),
      c('gnd', ComponentType.Ground, 100, 400)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'r1', 'p1'),
      w('w2', 'r1', 'p2', 'r2', 'p1'),
      w('w3', 'r2', 'p2', 'led', 'anode'),
      w('w4', 'led', 'cathode', 'gnd', 'gnd'),
      w('w5', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: 'parallel-resistors',
    name: isEs ? '3. Resistencias en Paralelo' : '3. Parallel Resistors',
    description: isEs
        ? "Ley de Corriente de Kirchhoff. En paralelo, el voltaje es igual, pero la corriente se divide. La resistencia total disminuye."
        : "Demonstrates Kirchhoff's Current Law. In parallel, voltage across each branch is the same, but the current splits. The total resistance decreases because there are more paths for current to flow.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('r1', ComponentType.Resistor, 300, 200, 0, { bands: ['red', 'red', 'red', 'gold'] }), // 2.2k
      c('r2', ComponentType.Resistor, 300, 400, 0, { bands: ['red', 'red', 'red', 'gold'] }), // 2.2k
      c('led', ComponentType.LED, 500, 300),
      c('gnd', ComponentType.Ground, 100, 400)
    ],
    wires: [
      // Source to Split Point
      w('w1', 'bat', 'pos', 'r1', 'p1'),
      w('w2', 'bat', 'pos', 'r2', 'p1'),
      // Rejoin at LED
      w('w3', 'r1', 'p2', 'led', 'anode'),
      w('w4', 'r2', 'p2', 'led', 'anode'),
      // Return
      w('w5', 'led', 'cathode', 'gnd', 'gnd'),
      w('w6', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: 'parallel-leds',
    name: isEs ? '4. LEDs en Paralelo' : '4. Parallel LEDs',
    description: isEs
        ? "Dos LEDs compartiendo fuente. En la vida real, compartir una resistencia para LEDs en paralelo no es ideal, pero aquí mostramos el concepto."
        : "Two LEDs connected in parallel sharing the same source. Note that in real life, sharing a single resistor for parallel LEDs is bad practice because slight manufacturing differences can cause one LED to hog all the current.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('r1', ComponentType.Resistor, 250, 300, 0, { bands: ['red', 'red', 'brown', 'gold'] }),
      c('led1', ComponentType.LED, 400, 200, 0, { color: 'green' }),
      c('led2', ComponentType.LED, 400, 400, 0, { color: 'blue' }),
      c('gnd', ComponentType.Ground, 550, 300)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'r1', 'p1'),
      w('w2', 'r1', 'p2', 'led1', 'anode'),
      w('w3', 'r1', 'p2', 'led2', 'anode'),
      w('w4', 'led1', 'cathode', 'gnd', 'gnd'),
      w('w5', 'led2', 'cathode', 'gnd', 'gnd'),
      w('w6', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: 'voltage-divider',
    name: isEs ? '5. Divisor de Voltaje' : '5. Voltage Divider',
    description: isEs
        ? "Crea un voltaje de referencia usando dos resistencias en serie. V_out = V_in * (R2 / (R1 + R2)). ¡Usa el multímetro para medir!"
        : "A fundamental circuit used to create a reference voltage. By using two resistors in series, the output voltage between them is a fraction of the input voltage. Formula: V_out = V_in * (R2 / (R1 + R2)).",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('r1', ComponentType.Resistor, 300, 200, 90, { bands: ['brown', 'black', 'red', 'gold'] }), // 1k top
      c('r2', ComponentType.Resistor, 300, 350, 90, { bands: ['brown', 'black', 'red', 'gold'] }), // 1k bottom
      c('gnd', ComponentType.Ground, 300, 450),
      c('meter', ComponentType.Multimeter, 500, 300, 0, { mode: 'V' }) // Pre-place a voltmeter
    ],
    wires: [
      w('w1', 'bat', 'pos', 'r1', 'p1'),
      w('w2', 'r1', 'p2', 'r2', 'p1'),
      w('w3', 'r2', 'p2', 'gnd', 'gnd'),
      w('w4', 'bat', 'neg', 'gnd', 'gnd'),
      // Meter connections
      w('w5', 'r1', 'p2', 'meter', 'red'),
      w('w6', 'gnd', 'gnd', 'meter', 'black')
    ]
  },

  // --- CAPACITORS ---
  {
    id: 'capacitors-series',
    name: isEs ? '6. Condensadores en Serie' : '6. Capacitors in Series',
    description: isEs
        ? "La capacitancia total disminuye en serie. Este circuito usa AC para mostrar que la corriente alterna puede 'pasar' cargando y descargando."
        : "When capacitors are placed in series, the total capacitance DECREASES (1/C_total = 1/C1 + 1/C2). This circuit uses an AC source to show that AC current can 'pass through' capacitors.",
    components: [
      c('ac', ComponentType.ACSource, 100, 300, 0, { peakVoltage: 10, frequency: 10 }),
      c('c1', ComponentType.Capacitor, 250, 300, 0, { capacitance: 100, isElectrolytic: true }),
      c('c2', ComponentType.Capacitor, 400, 300, 0, { capacitance: 100, isElectrolytic: true }),
      c('led', ComponentType.LED, 550, 300),
      c('gnd', ComponentType.Ground, 100, 400)
    ],
    wires: [
      w('w1', 'ac', 'p1', 'c1', 'p1'),
      w('w2', 'c1', 'p2', 'c2', 'p1'),
      w('w3', 'c2', 'p2', 'led', 'anode'),
      w('w4', 'led', 'cathode', 'gnd', 'gnd'),
      w('w5', 'ac', 'p2', 'gnd', 'gnd')
    ]
  },
  {
    id: 'capacitors-parallel',
    name: isEs ? '7. Condensadores en Paralelo' : '7. Capacitors in Parallel',
    description: isEs
        ? "En paralelo, la capacitancia se suma. Actúan como un tanque más grande. Abre el interruptor y mira cómo el LED se apaga lentamente."
        : "Capacitors in parallel add up their capacitance directly (C_total = C1 + C2). They act like a larger single tank for energy storage. Open the switch and observe how the LED fades out slowly.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('sw', ComponentType.Switch, 200, 300, 0, { isOpen: true }),
      c('res', ComponentType.Resistor, 300, 300, 0, { bands: ['brown', 'black', 'red', 'gold'] }), // Limit current
      c('c1', ComponentType.Capacitor, 450, 200, 0, { capacitance: 470, isElectrolytic: true }),
      c('c2', ComponentType.Capacitor, 450, 400, 0, { capacitance: 470, isElectrolytic: true }),
      c('led', ComponentType.LED, 600, 300),
      c('gnd', ComponentType.Ground, 100, 400)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'sw', 'in'),
      w('w2', 'sw', 'out', 'res', 'p1'),
      // Split to Caps
      w('w3', 'res', 'p2', 'c1', 'p1'),
      w('w4', 'res', 'p2', 'c2', 'p1'),
      w('w5', 'c1', 'p2', 'led', 'anode'),
      w('w6', 'c2', 'p2', 'led', 'anode'),
      // Return
      w('w7', 'led', 'cathode', 'gnd', 'gnd'),
      w('w8', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },

  // --- LOGIC GATES ---
  {
    id: 'logic-nand',
    name: isEs ? '8. Lógica NAND' : '8. Logic NAND',
    description: isEs
        ? "Compuerta Universal. Salida BAJA (0) solo si TODAS las entradas son ALTAS (1). Prueba los interruptores."
        : "The NAND (Not-AND) gate is a universal logic gate. The output is LOW (0) only if ALL inputs are HIGH (1). In all other cases, the output is HIGH.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('sw1', ComponentType.Switch, 250, 200, 0, { isOpen: true }),
      c('sw2', ComponentType.Switch, 250, 400, 0, { isOpen: true }),
      c('nand', ComponentType.NANDGate, 450, 300),
      c('led', ComponentType.LED, 600, 300, 0, { color: 'blue' }),
      c('gnd', ComponentType.Ground, 600, 400)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'sw1', 'in'),
      w('w2', 'bat', 'pos', 'sw2', 'in'),
      w('w3', 'sw1', 'out', 'nand', 'in1'),
      w('w4', 'sw2', 'out', 'nand', 'in2'),
      w('w5', 'nand', 'out', 'led', 'anode'),
      w('w6', 'led', 'cathode', 'gnd', 'gnd'),
      w('w7', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: 'logic-nor',
    name: isEs ? '9. Lógica NOR' : '9. Logic NOR',
    description: isEs
        ? "Salida ALTA (1) solo si TODAS las entradas son BAJAS (0). Si cualquiera es alta, la salida cae."
        : "The NOR (Not-OR) gate outputs HIGH (1) only if ALL inputs are LOW (0). If any input is HIGH, the output goes LOW.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('sw1', ComponentType.Switch, 250, 200, 0, { isOpen: true }),
      c('sw2', ComponentType.Switch, 250, 400, 0, { isOpen: true }),
      c('nor', ComponentType.NORGate, 450, 300),
      c('led', ComponentType.LED, 600, 300, 0, { color: 'yellow' }),
      c('gnd', ComponentType.Ground, 600, 400)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'sw1', 'in'),
      w('w2', 'bat', 'pos', 'sw2', 'in'),
      w('w3', 'sw1', 'out', 'nor', 'in1'),
      w('w4', 'sw2', 'out', 'nor', 'in2'),
      w('w5', 'nor', 'out', 'led', 'anode'),
      w('w6', 'led', 'cathode', 'gnd', 'gnd'),
      w('w7', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: 'logic-xor',
    name: isEs ? '10. Lógica XOR' : '10. Logic XOR',
    description: isEs
        ? "Salida ALTA (1) si las entradas son DIFERENTES. Crucial para sumadores en computación."
        : "The XOR (Exclusive-OR) gate outputs HIGH (1) if the inputs are DIFFERENT. If both are 0 or both are 1, the output is 0.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('sw1', ComponentType.Switch, 250, 200, 0, { isOpen: true }),
      c('sw2', ComponentType.Switch, 250, 400, 0, { isOpen: true }),
      c('xor', ComponentType.XORGate, 450, 300),
      c('led', ComponentType.LED, 600, 300, 0, { color: 'white' }),
      c('gnd', ComponentType.Ground, 600, 400)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'sw1', 'in'),
      w('w2', 'bat', 'pos', 'sw2', 'in'),
      w('w3', 'sw1', 'out', 'xor', 'in1'),
      w('w4', 'sw2', 'out', 'xor', 'in2'),
      w('w5', 'xor', 'out', 'led', 'anode'),
      w('w6', 'led', 'cathode', 'gnd', 'gnd'),
      w('w7', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },

  // --- SEMICONDUCTORS & ACTIVE ---
  {
    id: 'transistor-switch',
    name: isEs ? '11. Interruptor Transistor NPN' : '11. NPN Transistor Switch',
    description: isEs
        ? "El transistor permite que una pequeña corriente (Base) controle una mayor (Colector). Aquí, el interruptor activa la Base."
        : "A transistor allows a small current (Base-Emitter) to control a much larger current (Collector-Emitter). Here, the switch activates the Base.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      // Control Circuit
      c('sw', ComponentType.Switch, 200, 200, 0, { isOpen: true }),
      c('r_base', ComponentType.Resistor, 300, 200, 0, { bands: ['red', 'red', 'red', 'gold'] }), // 2.2k Base resistor
      // Load Circuit
      c('r_load', ComponentType.Resistor, 350, 100, 0, { bands: ['brown', 'black', 'red', 'gold'] }), // 1k Load resistor
      c('led', ComponentType.LED, 450, 100, 0, { color: 'green' }),
      // Transistor
      c('npn', ComponentType.TransistorNPN, 400, 300),
      c('gnd', ComponentType.Ground, 400, 450)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'sw', 'in'),
      w('w2', 'sw', 'out', 'r_base', 'p1'),
      w('w3', 'r_base', 'p2', 'npn', 'b'), // Into Base
      
      w('w4', 'bat', 'pos', 'r_load', 'p1'), // Power to load
      w('w5', 'r_load', 'p2', 'led', 'anode'),
      w('w6', 'led', 'cathode', 'npn', 'c'), // Load into Collector
      
      w('w7', 'npn', 'e', 'gnd', 'gnd'), // Emitter to Ground
      w('w8', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: 'bridge-rectifier',
    name: isEs ? '12. Puente Rectificador' : '12. Full Wave Bridge Rectifier',
    description: isEs
        ? "Convierte AC (que oscila positivo/negativo) en DC pulsante (solo una dirección). Observa la animación de la corriente."
        : "This arrangement of 4 diodes converts AC (Alternating Current) into pulsating DC (Direct Current) which only flows one way.",
    components: [
      c('ac', ComponentType.ACSource, 100, 300, 0, { peakVoltage: 12, frequency: 2 }), // Low freq to see animation
      // Bridge Diodes
      c('d1', ComponentType.Diode, 300, 200, 90), // Top Left
      c('d2', ComponentType.Diode, 400, 200, 90), // Top Right
      c('d3', ComponentType.Diode, 300, 400, 90), // Bottom Left
      c('d4', ComponentType.Diode, 400, 400, 90), // Bottom Right
      // Load
      c('res', ComponentType.Resistor, 550, 300, 90, { bands: ['brown', 'black', 'red', 'gold'] }), // Load
      c('gnd', ComponentType.Ground, 100, 400) // Ref only
    ],
    wires: [
      // AC Inputs to Bridge Nodes
      w('w_ac1_1', 'ac', 'p1', 'd1', 'anode'),
      w('w_ac1_2', 'ac', 'p1', 'd3', 'cathode'),
      
      w('w_ac2_1', 'ac', 'p2', 'd2', 'anode'),
      w('w_ac2_2', 'ac', 'p2', 'd4', 'cathode'),
      
      // DC Output Positive: D1(K) + D2(K)
      w('w_dc_pos1', 'd1', 'cathode', 'res', 'p1'),
      w('w_dc_pos2', 'd2', 'cathode', 'res', 'p1'),
      
      // DC Output Negative: D3(A) + D4(A)
      w('w_dc_neg1', 'd3', 'anode', 'res', 'p2'),
      w('w_dc_neg2', 'd4', 'anode', 'res', 'p2'),
      
      // Ground Ref for Sim stability
      w('w_gnd', 'ac', 'p2', 'gnd', 'gnd')
    ]
  },
  {
    id: 'pot-control',
    name: isEs ? '13. Control con Potenciómetro' : '13. Potentiometer Control',
    description: isEs
        ? "Usa un potenciómetro como divisor de voltaje variable para enviar una señal analógica (0-5V) a la Base del transistor, controlando el brillo del LED."
        : "Using a potentiometer as a variable voltage divider allows you to send an analog signal (0-5V) to the Base of a transistor, controlling LED brightness.",
    components: [
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('pot', ComponentType.Potentiometer, 250, 300),
      c('npn', ComponentType.TransistorNPN, 400, 300),
      c('led', ComponentType.LED, 500, 200),
      c('r', ComponentType.Resistor, 500, 100, 90, { bands: ['brown', 'black', 'brown', 'gold'] }), // 100 ohm
      c('gnd', ComponentType.Ground, 100, 450)
    ],
    wires: [
      w('w1', 'bat', 'pos', 'pot', 'p1'),
      w('w2', 'pot', 'p2', 'gnd', 'gnd'),
      w('w3', 'pot', 'wiper', 'npn', 'b'), // Wiper controls base
      w('w4', 'bat', 'pos', 'r', 'p1'),
      w('w5', 'r', 'p2', 'led', 'anode'),
      w('w6', 'led', 'cathode', 'npn', 'c'),
      w('w7', 'npn', 'e', 'gnd', 'gnd'),
      w('w8', 'bat', 'neg', 'gnd', 'gnd')
    ]
  },
  {
    id: '555-astable',
    name: isEs ? '14. Oscilador 555 Astable' : '14. 555 Timer Astable',
    description: isEs
        ? "Configuración 'Astable'. La red R1, R2 y C crea un ciclo de carga/descarga que dispara el 555 repetidamente, haciendo parpadear el LED."
        : "The 555 Timer allows us to create oscillations. This configuration is called 'Astable Multivibrator'. It flips its output ON and OFF repeatedly.",
    components: [
      c('ic', ComponentType.IC555, 400, 300),
      c('bat', ComponentType.VoltageSource, 100, 300),
      c('gnd', ComponentType.Ground, 400, 500),
      c('r1', ComponentType.Resistor, 300, 150, 90, { bands: ['brown', 'black', 'red', 'gold'] }), // 1k (VCC to DIS)
      c('r2', ComponentType.Resistor, 300, 250, 90, { bands: ['orange', 'orange', 'red', 'gold'] }), // 3.3k (DIS to THR)
      c('cap', ComponentType.Capacitor, 300, 400, 0, { capacitance: 100, isElectrolytic: true }), // 100uF
      c('led', ComponentType.LED, 550, 300),
      c('r_lim', ComponentType.Resistor, 550, 400, 90, { bands: ['red', 'red', 'brown', 'gold'] }) // 220 ohm
    ],
    wires: [
      // Power
      w('pwr1', 'bat', 'pos', 'ic', 'vcc'),
      w('pwr2', 'bat', 'pos', 'ic', 'rst'), // Reset high
      w('pwr3', 'bat', 'neg', 'gnd', 'gnd'),
      w('pwr4', 'ic', 'gnd', 'gnd', 'gnd'),

      // Timing Network
      w('t1', 'bat', 'pos', 'r1', 'p1'),
      w('t2', 'r1', 'p2', 'ic', 'dis'), // R1 to Discharge
      w('t3', 'ic', 'dis', 'r2', 'p1'), // Discharge to R2
      w('t4', 'r2', 'p2', 'ic', 'thr'), // R2 to Threshold
      w('t5', 'ic', 'thr', 'ic', 'trig'), // Threshold connected to Trigger
      w('t6', 'ic', 'trig', 'cap', 'p1'), // Trigger to Cap
      w('t7', 'cap', 'p2', 'gnd', 'gnd'),

      // Output
      w('out1', 'ic', 'out', 'led', 'anode'),
      w('out2', 'led', 'cathode', 'r_lim', 'p1'),
      w('out3', 'r_lim', 'p2', 'gnd', 'gnd')
    ]
  }
  ];
};
