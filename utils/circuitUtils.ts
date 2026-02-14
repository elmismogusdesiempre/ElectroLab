
import { GRID_SIZE, BAND_VALUES, MULTIPLIER_VALUES, COMPONENT_PINS } from '../constants';
import { Point, ComponentData, Pin, ResistorBandColor, Wire, ComponentType } from '../types';

export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export const rotatePoint = (point: Point, angle: number): Point => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: point.x * Math.cos(rad) - point.y * Math.sin(rad),
    y: point.x * Math.sin(rad) + point.y * Math.cos(rad)
  };
};

export const getPinAbsolutePosition = (component: ComponentData, pinId: string): Point => {
  const pins = COMPONENT_PINS[component.type];
  const pin = pins.find(p => p.id === pinId);
  if (!pin) return { x: component.x, y: component.y };

  let pinX = pin.x;
  let pinY = pin.y;

  // Handle Dynamic Scaling for Multimeter
  if (component.type === ComponentType.Multimeter && component.properties.size === 'large') {
      pinX *= 2;
      pinY *= 2;
  }

  const rotated = rotatePoint({ x: pinX, y: pinY }, component.rotation);
  return {
    x: component.x + rotated.x,
    y: component.y + rotated.y
  };
};

export const calculateResistance = (bands?: ResistorBandColor[]): number => {
  if (!bands || bands.length < 4) return 0;
  
  const d1 = BAND_VALUES[bands[0]] || 0;
  const d2 = BAND_VALUES[bands[1]] || 0;

  // 5-Band Logic
  if (bands.length === 5) {
      const d3 = BAND_VALUES[bands[2]] || 0;
      const multiplier = MULTIPLIER_VALUES[bands[3]] || 1;
      return (d1 * 100 + d2 * 10 + d3) * multiplier;
  }

  // 4-Band Logic
  const multiplier = MULTIPLIER_VALUES[bands[2]] || 1;
  return (d1 * 10 + d2) * multiplier;
};

export const formatResistance = (ohms: number): string => {
  if (!isFinite(ohms) || ohms > 1000000000) return "OL"; // Open Loop
  if (ohms < 0.1) return "0.00Ω";
  if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(2).replace(/\.00$/, '')}MΩ`;
  if (ohms >= 1000) return `${(ohms / 1000).toFixed(2).replace(/\.00$/, '')}kΩ`;
  return `${ohms.toFixed(2).replace(/\.00$/, '')}Ω`;
};

export const formatCapacitance = (microFarads: number): string => {
    if (microFarads >= 1000) return `${(microFarads / 1000).toFixed(1)}mF`;
    if (microFarads >= 1) return `${microFarads.toFixed(1).replace(/\.0$/, '')}µF`;
    if (microFarads >= 0.001) return `${(microFarads * 1000).toFixed(0)}nF`;
    return `${(microFarads * 1000000).toFixed(0)}pF`;
};

export const formatCurrent = (amps: number): string => {
    const absAmps = Math.abs(amps);
    if (absAmps < 0.000001) return "0.00A";
    if (absAmps < 0.001) return `${(amps * 1000000).toFixed(1)}µA`;
    if (absAmps < 1) return `${(amps * 1000).toFixed(1)}mA`;
    return `${amps.toFixed(2)}A`;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Advanced Circuit Analysis (MNA) ---

export type WireStatus = 'positive' | 'ground' | 'neutral';

export interface NetInfo {
    id: number;
    voltage: number;
    status: WireStatus;
}

const getPinKey = (compId: string, pinId: string) => `${compId}:${pinId}`;

// Groups connected wires into integer Net IDs
export const buildNetMap = (wires: Wire[]): { 
    wireToNet: Map<string, number>, 
    pinToNet: Map<string, number>, 
    netCount: number 
} => {
    const wireToNet = new Map<string, number>();
    const pinToNet = new Map<string, number>();
    const pinsToWires: Record<string, string[]> = {};
    
    wires.forEach(w => {
        const k1 = getPinKey(w.fromCompId, w.fromPinId);
        const k2 = getPinKey(w.toCompId, w.toPinId);
        if(!pinsToWires[k1]) pinsToWires[k1] = [];
        if(!pinsToWires[k2]) pinsToWires[k2] = [];
        pinsToWires[k1].push(w.id);
        pinsToWires[k2].push(w.id);
    });

    let netCounter = 0;
    const visitedWires = new Set<string>();

    const assignNet = (startWireId: string) => {
        const currentNetId = netCounter++;
        const queue = [startWireId];
        visitedWires.add(startWireId);
        wireToNet.set(startWireId, currentNetId);

        while(queue.length > 0) {
            const wid = queue.shift()!;
            const w = wires.find(x => x.id === wid);
            if (!w) continue;
            
            [getPinKey(w.fromCompId, w.fromPinId), getPinKey(w.toCompId, w.toPinId)].forEach(pinKey => {
                pinToNet.set(pinKey, currentNetId);
                const neighbors = pinsToWires[pinKey] || [];
                neighbors.forEach(nId => {
                    if (!visitedWires.has(nId)) {
                        visitedWires.add(nId);
                        wireToNet.set(nId, currentNetId);
                        queue.push(nId);
                    }
                });
            });
        }
    };

    wires.forEach(w => {
        if (!visitedWires.has(w.id)) assignNet(w.id);
    });

    return { wireToNet, pinToNet, netCount: netCounter };
};

// --- Safety Check: Detect Short Circuits ---
export const detectShortCircuit = (components: ComponentData[], wires: Wire[]): string | null => {
    const { pinToNet } = buildNetMap(wires);
    
    // Check Voltage Sources
    for (const comp of components) {
        if (comp.type === ComponentType.VoltageSource) {
            const posKey = getPinKey(comp.id, 'pos');
            const negKey = getPinKey(comp.id, 'neg');
            
            // If both pins are connected (have a net ID) AND share the SAME net ID -> Short Circuit
            if (pinToNet.has(posKey) && pinToNet.has(negKey)) {
                if (pinToNet.get(posKey) === pinToNet.get(negKey)) {
                    return 'source';
                }
            }
        }
    }
    return null;
};

// Gaussian Elimination Solver
const solveLinearSystem = (matrix: number[][], rhs: number[]): number[] => {
    const n = matrix.length;
    if (n === 0) return [];
    
    // Augment matrix with rhs
    const M = matrix.map((row, i) => [...row, rhs[i]]);

    for (let i = 0; i < n; i++) {
        let pivotRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(M[j][i]) > Math.abs(M[pivotRow][i])) pivotRow = j;
        }
        [M[i], M[pivotRow]] = [M[pivotRow], M[i]];

        const pivot = M[i][i];
        if (Math.abs(pivot) < 1e-10) continue; 

        for (let j = i; j <= n; j++) M[i][j] /= pivot;

        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = M[k][i];
                for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
            }
        }
    }
    return M.map(row => row[n]);
};

// --- Full Circuit Solver (Voltages & Currents) ---
export const solveCircuit = (
    components: ComponentData[],
    wires: Wire[],
    supplyVoltage: number
): { voltages: Map<number, number>, currents: Map<string, number> } => {
    
    const { pinToNet, netCount } = buildNetMap(wires);
    
    // Find Ground Nets
    const groundNets = new Set<number>();
    components.forEach(c => {
        if (c.type === ComponentType.Ground) {
            const n = pinToNet.get(getPinKey(c.id, 'gnd'));
            if (n !== undefined) groundNets.add(n);
        }
        // 555 Pin 1 is also a ground reference usually, but for solving, we need explicit ground component
    });

    const refNet = groundNets.size > 0 ? Array.from(groundNets)[0] : -1;

    interface VoltageSourceInfo {
        id: string; // Component ID
        nPos: number;
        nNeg: number;
        voltage: number;
        index: number; 
    }

    const getNet = (cId: string, pId: string) => {
        const k = getPinKey(cId, pId);
        return pinToNet.has(k) ? pinToNet.get(k)! : -1;
    };

    const voltageSources: VoltageSourceInfo[] = [];

    // Identify Voltage Sources
    components.forEach(c => {
        if (c.type === ComponentType.VoltageSource) {
            const nPos = getNet(c.id, 'pos');
            const nNeg = getNet(c.id, 'neg');
            if (nPos !== -1 && nNeg !== -1) {
                voltageSources.push({ id: c.id, nPos, nNeg, voltage: supplyVoltage, index: 0 });
            }
        }
        if (c.type === ComponentType.Multimeter && c.properties.mode === 'A') {
            const nPos = getNet(c.id, 'red');
            const nNeg = getNet(c.id, 'black');
            if (nPos !== -1 && nNeg !== -1) {
                voltageSources.push({ id: c.id, nPos, nNeg, voltage: 0, index: 0 });
            }
        }
        // IC555 Output Pin Driving High/Low
        if (c.type === ComponentType.IC555) {
            // If the 555 is actively driving (Simulated in App.tsx), we treat output pin relative to Ground
            const nOut = getNet(c.id, 'out');
            const nGnd = getNet(c.id, 'gnd'); // Usually connected to ground net
            
            // Logic: The 555 Output is modeled as a Voltage Source.
            // If logic state is High -> V = Supply. If Low -> V = 0.
            // We use properties set by the simulation loop in App.tsx
            const isOutputHigh = c.properties.outputHigh === true;
            
            if (nOut !== -1 && nGnd !== -1) {
                voltageSources.push({ 
                    id: `${c.id}_out`, 
                    nPos: nOut, 
                    nNeg: nGnd, 
                    voltage: isOutputHigh ? supplyVoltage : 0.1, // 0.1V offset to avoid singular if perfect short
                    index: 0 
                });
            }
        }
    });

    voltageSources.forEach((vs, i) => vs.index = netCount + i);

    const matrixSize = netCount + voltageSources.length;
    const G = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(0));
    const I_rhs = Array(matrixSize).fill(0);

    const addResistor = (n1: number, n2: number, r: number) => {
        if (n1 === -1 && n2 === -1) return;
        const g = 1/r;
        if (n1 !== -1) G[n1][n1] += g;
        if (n2 !== -1) G[n2][n2] += g;
        if (n1 !== -1 && n2 !== -1) {
            G[n1][n2] -= g;
            G[n2][n1] -= g;
        }
    };

    // Fill Matrix
    components.forEach(c => {
        if (c.type === ComponentType.Resistor) {
            addResistor(getNet(c.id, 'p1'), getNet(c.id, 'p2'), calculateResistance(c.properties.bands));
        }
        else if (c.type === ComponentType.Potentiometer) {
             const totalR = c.properties.totalResistance || 10000;
             const pos = (c.properties.wiperPosition !== undefined ? c.properties.wiperPosition : 50) / 100;
             const r1 = Math.max(0.1, totalR * pos); 
             const r2 = Math.max(0.1, totalR * (1 - pos));
             const n1 = getNet(c.id, 'p1');
             const n2 = getNet(c.id, 'p2');
             const nWiper = getNet(c.id, 'wiper');
             if (nWiper !== -1) {
                 addResistor(n1, nWiper, r1);
                 addResistor(nWiper, n2, r2);
             } else {
                 addResistor(n1, n2, totalR);
             }
        }
        else if (c.type === ComponentType.Switch && !c.properties.isOpen) {
             addResistor(getNet(c.id, 'in'), getNet(c.id, 'out'), 0.01);
        }
        else if (c.type === ComponentType.LED) {
             addResistor(getNet(c.id, 'anode'), getNet(c.id, 'cathode'), 100);
        }
        else if (c.type === ComponentType.IC555) {
            // Discharge Pin Logic (Pin 7)
            // If Logic High (FlipFlop Set) -> Discharge is OPEN (High Impedance)
            // If Logic Low (FlipFlop Reset) -> Discharge is CLOSED (Short to Ground)
            const nDis = getNet(c.id, 'dis');
            const nGnd = getNet(c.id, 'gnd');
            const isOutputHigh = c.properties.outputHigh === true;
            
            // If output is low, transistor is ON, pulling pin 7 to ground
            const rDischarge = isOutputHigh ? 100000000 : 10; // 100M Ohm vs 10 Ohm
            addResistor(nDis, nGnd, rDischarge);
            
            // Internal Voltage Divider (3x 5k Resistors)
            // VCC -> 5k -> THR/CTRL -> 5k -> TRIG -> 5k -> GND
            const nVcc = getNet(c.id, 'vcc');
            const nThr = getNet(c.id, 'thr'); // Pin 6 (and 5 roughly)
            const nTrig = getNet(c.id, 'trig'); // Pin 2
            
            // To simplify, we model the divider chain connected to the pins
            // VCC -> THR (5k)
            addResistor(nVcc, nThr, 5000);
            // THR -> TRIG (5k)
            addResistor(nThr, nTrig, 5000);
            // TRIG -> GND (5k)
            addResistor(nTrig, nGnd, 5000);
        }
    });

    voltageSources.forEach(vs => {
        const { nPos, nNeg, voltage, index } = vs;
        if (nPos !== -1) {
            G[nPos][index] = 1; 
            G[index][nPos] = 1; 
        }
        if (nNeg !== -1) {
            G[nNeg][index] = -1;
            G[index][nNeg] = -1;
        }
        I_rhs[index] = voltage;
    });

    if (refNet !== -1) {
        for (let i = 0; i < matrixSize; i++) G[refNet][i] = 0;
        G[refNet][refNet] = 1;
        I_rhs[refNet] = 0;
    } else {
        for(let i=0; i<netCount; i++) G[i][i] += 1e-9; 
    }

    const solution = solveLinearSystem(G, I_rhs);

    const voltages = new Map<number, number>();
    const currents = new Map<string, number>();

    for(let i=0; i<netCount; i++) voltages.set(i, solution[i]);
    
    voltageSources.forEach(vs => {
        currents.set(vs.id, solution[vs.index]);
    });

    return { voltages, currents };
};

// ... (Rest of utils remains similar, ensuring measureResistance handles components correctly if needed, but primary logic is in solveCircuit)
export const measureResistance = (
    components: ComponentData[], 
    wires: Wire[], 
    probeA: { compId: string, pinId: string }, 
    probeB: { compId: string, pinId: string }
): number => {
    
    const { pinToNet, netCount } = buildNetMap(wires);
    const keyA = getPinKey(probeA.compId, probeA.pinId);
    const keyB = getPinKey(probeB.compId, probeB.pinId);
    const netA = pinToNet.get(keyA);
    const netB = pinToNet.get(keyB);

    if (netA === undefined || netB === undefined) return Infinity; 
    if (netA === netB) return 0;

    let systemSize = netCount;
    const resistorList: { n1: number, n2: number, g: number }[] = [];

    const getSafeNet = (compId: string, pinId: string) => {
        const key = getPinKey(compId, pinId);
        if (pinToNet.has(key)) return pinToNet.get(key)!;
        return systemSize++;
    };

    components.forEach(c => {
        if (c.type === ComponentType.Resistor) {
            const n1 = getSafeNet(c.id, 'p1');
            const n2 = getSafeNet(c.id, 'p2');
            const r = calculateResistance(c.properties.bands);
            if (r > 0) resistorList.push({ n1, n2, g: 1/r });
        } 
        else if (c.type === ComponentType.Potentiometer) {
             const totalR = c.properties.totalResistance || 10000;
             const pos = (c.properties.wiperPosition !== undefined ? c.properties.wiperPosition : 50) / 100;
             const r1 = Math.max(0.1, totalR * pos); 
             const r2 = Math.max(0.1, totalR * (1 - pos));
             const n1 = getSafeNet(c.id, 'p1');
             const n2 = getSafeNet(c.id, 'p2');
             const nWiper = getSafeNet(c.id, 'wiper');
             resistorList.push({ n1, n2: nWiper, g: 1/r1 });
             resistorList.push({ n1: nWiper, n2, g: 1/r2 });
        }
        else if (c.type === ComponentType.Switch && c.properties.isOpen === false) {
             const n1 = getSafeNet(c.id, 'in');
             const n2 = getSafeNet(c.id, 'out');
             resistorList.push({ n1, n2, g: 1/0.1 }); 
        }
    });

    const nodeToIndex = new Map<number, number>();
    let index = 0;
    for (let i = 0; i < systemSize; i++) {
        if (i !== netB) nodeToIndex.set(i, index++);
    }

    const N = systemSize - 1; 
    if (N === 0) return 0; 

    const G = Array(N).fill(0).map(() => Array(N).fill(0));
    const I = Array(N).fill(0);

    if (nodeToIndex.has(netA)) {
        I[nodeToIndex.get(netA)!] = 1;
    }

    resistorList.forEach(({ n1, n2, g }) => {
        const i1 = nodeToIndex.has(n1) ? nodeToIndex.get(n1) : -1;
        const i2 = nodeToIndex.has(n2) ? nodeToIndex.get(n2) : -1;

        if (i1 !== -1) {
            G[i1][i1] += g;
            if (i2 !== -1) G[i1][i2] -= g;
        }
        if (i2 !== -1) {
            G[i2][i2] += g;
            if (i1 !== -1) G[i2][i1] -= g;
        }
    });

    const voltages = solveLinearSystem(G, I);
    
    const idxA = nodeToIndex.get(netA);
    if (idxA !== undefined && idxA < voltages.length) {
        return Math.max(0, voltages[idxA]); 
    }

    return Infinity;
};

export const identifyWireNets = (
    components: ComponentData[], 
    wires: Wire[], 
    supplyVoltage: number
): Record<string, NetInfo> => {
    
    const { voltages, currents } = solveCircuit(components, wires, supplyVoltage);
    const { wireToNet } = buildNetMap(wires);
    
    const result: Record<string, NetInfo> = {};
    
    wireToNet.forEach((netId, wireId) => {
        const v = voltages.get(netId) || 0;
        let status: WireStatus = 'neutral';
        if (v > supplyVoltage * 0.9) status = 'positive';
        else if (v < 0.5) status = 'ground';
        
        result[wireId] = { id: netId, voltage: v, status };
    });

    return result;
};


interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

export const createObstacleMap = (components: ComponentData[]): Set<string> => {
  const obstacles = new Set<string>();
  if (!components) return obstacles;
  components.forEach(comp => {
    const cx = Math.round(comp.x / GRID_SIZE);
    const cy = Math.round(comp.y / GRID_SIZE);
    // Obstacle is 3x3 grid around component center
    for(let ox = -1; ox <= 1; ox++) {
      for(let oy = -1; oy <= 1; oy++) {
         obstacles.add(`${cx + ox},${cy + oy}`);
      }
    }
  });
  return obstacles;
};

export const generatePathData = (start: Point, end: Point, waypoints: Point[]): string => {
    let d = `M ${start.x} ${start.y}`;
    waypoints.forEach(p => {
        d += ` L ${p.x} ${p.y}`;
    });
    d += ` L ${end.x} ${end.y}`;
    return d;
}

const pointsToPath = (points: Point[]): string => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
};

export const getWirePath = (start: Point, end: Point, allObstacles: Set<string>, waypoints: Point[] = []): string => {
  if (waypoints && waypoints.length > 0) {
      return generatePathData(start, end, waypoints);
  }

  const sx = Math.round(start.x / GRID_SIZE);
  const sy = Math.round(start.y / GRID_SIZE);
  const ex = Math.round(end.x / GRID_SIZE);
  const ey = Math.round(end.y / GRID_SIZE);

  if (sx === ex && sy === ey) return `M ${start.x} ${start.y}`;

  const getSimplePath = () => {
      const midX = (start.x + end.x) / 2;
      return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  };

  const dist = Math.abs(sx - ex) + Math.abs(sy - ey);
  if (dist < 8) return getSimplePath(); 

  if (Math.abs(sx - ex) > 100 || Math.abs(sy - ey) > 100) return getSimplePath();

  const isBlocked = (x: number, y: number) => {
      if (x === sx && y === sy) return false;
      if (x === ex && y === ey) return false;
      return allObstacles.has(`${x},${y}`);
  };

  const padding = 10;
  const minX = Math.min(sx, ex) - padding;
  const maxX = Math.max(sx, ex) + padding;
  const minY = Math.min(sy, ey) - padding;
  const maxY = Math.max(sy, ey) + padding;

  const openList: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = { x: sx, y: sy, g: 0, h: 0, f: 0, parent: null };
  startNode.h = Math.abs(ex - sx) + Math.abs(ey - sy); 
  startNode.f = startNode.h;
  
  openList.push(startNode);

  let iterations = 0;
  const MAX_ITERATIONS = 2000; 

  while (openList.length > 0) {
    iterations++;
    if (iterations > MAX_ITERATIONS) return getSimplePath();

    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;
    const key = `${current.x},${current.y}`;

    if (current.x === ex && current.y === ey) {
      let path: Point[] = [];
      let curr: Node | null = current;
      while (curr) {
        path.push({ x: curr.x * GRID_SIZE, y: curr.y * GRID_SIZE });
        curr = curr.parent;
      }
      return pointsToPath(path.reverse());
    }

    closedSet.add(key);

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (neighbor.x < minX || neighbor.x > maxX || neighbor.y < minY || neighbor.y > maxY) continue;
      if (closedSet.has(neighborKey)) continue;
      if (isBlocked(neighbor.x, neighbor.y)) continue;

      let turnPenalty = 0;
      if (current.parent) {
          const prevDx = current.x - current.parent.x;
          const prevDy = current.y - current.parent.y;
          const newDx = neighbor.x - current.x;
          const newDy = neighbor.y - current.y;
          if (prevDx !== newDx || prevDy !== newDy) turnPenalty = 5; 
      }
      
      const gScore = current.g + 1 + turnPenalty;
      const existingNodeIndex = openList.findIndex(n => n.x === neighbor.x && n.y === neighbor.y);
      if (existingNodeIndex !== -1 && gScore >= openList[existingNodeIndex].g) continue;

      const hScore = Math.abs(ex - neighbor.x) + Math.abs(ey - neighbor.y);
      const newNode: Node = {
        x: neighbor.x,
        y: neighbor.y,
        g: gScore,
        h: hScore,
        f: gScore + hScore,
        parent: current
      };

      if (existingNodeIndex !== -1) {
        openList[existingNodeIndex] = newNode;
      } else {
        openList.push(newNode);
      }
    }
  }

  return getSimplePath();
};
