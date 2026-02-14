
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

export const PRESETS: Preset[] = [
  // --- BASICS ---
  {
    id: 'basic-led',
    name: '1. Basic LED Circuit',
    description: "The 'Hello World' of electronics. This circuit demonstrates the minimal requirements to light an LED safely. It uses a DC Voltage Source to provide power, and a Resistor to limit the current flowing through the LED, preventing it from burning out. Observe how the LED only lights up when the circuit is closed.",
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
    name: '2. Series Resistors',
    description: "Demonstrates Kirchhoff's Voltage Law. In a series circuit, current is constant throughout, but voltage drops across each component. The total resistance is the sum of all individual resistors (R_total = R1 + R2). Notice how the LED might be dimmer compared to a single resistor circuit if the total resistance is high.",
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
    name: '3. Parallel Resistors',
    description: "Demonstrates Kirchhoff's Current Law. In parallel, voltage across each branch is the same, but the current splits. The total resistance decreases because there are more paths for current to flow. The equivalent resistance is calculated as 1 / (1/R1 + 1/R2).",
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
    name: '4. Parallel LEDs',
    description: "Two LEDs connected in parallel sharing the same source. Note that in real life, sharing a single resistor for parallel LEDs is bad practice because slight manufacturing differences can cause one LED to hog all the current. Here, we use a single resistor before the split for simplicity to show they both light up.",
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
    name: '5. Voltage Divider',
    description: "A fundamental circuit used to create a reference voltage. By using two resistors in series, the output voltage between them is a fraction of the input voltage. Formula: V_out = V_in * (R2 / (R1 + R2)). Use the multimeter to verify the voltage at the midpoint!",
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
    name: '6. Capacitors in Series',
    description: "When capacitors are placed in series, the total capacitance DECREASES (1/C_total = 1/C1 + 1/C2), but the voltage rating of the combined bank increases. This circuit uses an AC source to show that AC current can 'pass through' capacitors (via charging/discharging), lighting the LED.",
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
    name: '7. Capacitors in Parallel',
    description: "Capacitors in parallel add up their capacitance directly (C_total = C1 + C2). They act like a larger single tank for energy storage. Open the switch and observe how the LED fades out slowly as the parallel capacitors discharge their stored energy.",
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
    name: '8. Logic NAND',
    description: "The NAND (Not-AND) gate is a universal logic gate. The output is LOW (0) only if ALL inputs are HIGH (1). In all other cases, the output is HIGH. Try toggling the switches to see the truth table in action.",
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
    name: '9. Logic NOR',
    description: "The NOR (Not-OR) gate outputs HIGH (1) only if ALL inputs are LOW (0). If any input is HIGH, the output goes LOW. This is another universal gate type often used in digital memory latches.",
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
    name: '10. Logic XOR',
    description: "The XOR (Exclusive-OR) gate outputs HIGH (1) if the inputs are DIFFERENT. If both are 0 or both are 1, the output is 0. This logic is crucial for arithmetic circuits (like adders) in computers.",
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
    name: '11. NPN Transistor Switch',
    description: "A transistor allows a small current (Base-Emitter) to control a much larger current (Collector-Emitter). Here, the switch activates the Base, allowing current to flow through the LED connected to the Collector. This is the foundation of digital logic and power control.",
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
    name: '12. Full Wave Bridge Rectifier',
    description: "This clever arrangement of 4 diodes converts AC (Alternating Current), which swings positive and negative, into pulsating DC (Direct Current) which only flows one way. Follow the animated current dots to see how the path changes during each half of the AC cycle, but always enters the resistor in the same direction.",
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
    name: '13. Potentiometer Control',
    description: "Using a potentiometer as a variable voltage divider allows you to send an analog signal (0-5V) to the Base of a transistor. As you move the wiper, the base voltage increases, turning the transistor 'more ON' (in its active region), which makes the LED brighter.",
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
    name: '14. 555 Timer Astable',
    description: "The 555 Timer allows us to create oscillations. This configuration is called 'Astable Multivibrator'. Resistors R1, R2 and Capacitor C form a timing network. The capacitor charges through R1+R2 and discharges through R2 only. This cycle triggers the 555 to flip its output ON and OFF repeatedly, flashing the LED.",
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
