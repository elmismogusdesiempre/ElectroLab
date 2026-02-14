
import React from 'react';
import { ComponentData, ComponentType, ResistorBandColor } from '../types';
import { BAND_COLORS, COMPONENT_PINS } from '../constants';
import { Settings, Power } from 'lucide-react';
import { calculateResistance, formatResistance, formatCapacitance } from '../utils/circuitUtils';

interface Props {
  component: ComponentData;
  isSelected: boolean;
  onEdit?: () => void;
  onModeChange?: (mode: string) => void;
  showLabels: boolean;
}

const LED_COLORS: Record<string, string> = {
    red: '#ff2222',
    green: '#22c55e',
    blue: '#3b82f6',
    yellow: '#eab308',
    orange: '#f97316',
    white: '#f8fafc'
};

const ResistorSVG: React.FC<{ bands?: ResistorBandColor[] }> = ({ bands = [] }) => {
    let positions: number[] = [];
    if (bands.length === 5) {
        positions = [-16, -8, 0, 8, 16];
    } else {
        positions = [-15, -5, 5, 15];
    }

    return (
        <g>
            <path d="M -40 0 L -25 0 L -20 -10 L -10 10 L 0 -10 L 10 10 L 20 -10 L 25 0 L 40 0" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="-25" y="-7" width="50" height="14" rx="2" fill="#E5E7EB" stroke="none" />
            {bands.map((color, index) => (
                 <rect 
                    key={index}
                    x={positions[index] !== undefined ? positions[index] : 0} 
                    y="-7" 
                    width={bands.length === 5 ? "4" : "5"} 
                    height="14" 
                    fill={BAND_COLORS[color] || BAND_COLORS['black']} 
                 />
            ))}
        </g>
    );
};

const PotentiometerSVG = () => (
    <g>
        {/* Resistor body */}
        <path d="M -40 10 L -25 10 L -20 0 L -10 20 L 0 0 L 10 20 L 20 0 L 25 10 L 40 10" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Wiper Arrow */}
        <path d="M 0 -20 L 0 0" stroke="currentColor" strokeWidth="2" />
        <path d="M -3 -5 L 0 0 L 3 -5" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Knob Circle */}
        <circle cx="0" cy="-25" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
    </g>
);

const CapacitorSVG: React.FC<{ isElectrolytic?: boolean }> = ({ isElectrolytic }) => (
  <g>
    <path d="M -20 0 L -5 0" stroke="currentColor" strokeWidth="2" />
    <path d="M 20 0 L 5 0" stroke="currentColor" strokeWidth="2" />
    
    {/* Plate 1 (Left/Anode) */}
    <line x1="-5" y1="-15" x2="-5" y2="15" stroke="currentColor" strokeWidth="3" />
    
    {/* Plate 2 (Right/Cathode) */}
    {isElectrolytic ? (
         <path d="M 5 -15 Q 10 0 5 15" stroke="currentColor" strokeWidth="3" fill="none" />
    ) : (
         <line x1="5" y1="-15" x2="5" y2="15" stroke="currentColor" strokeWidth="3" />
    )}

    {/* Plus sign for electrolytic */}
    {isElectrolytic && (
        <g transform="translate(-12, -10) scale(0.6)">
            <path d="M 0 -5 L 0 5 M -5 0 L 5 0" stroke="currentColor" strokeWidth="2" />
        </g>
    )}
  </g>
);

const DiodeSVG = () => (
    <g>
        <path d="M -20 0 L -10 0" stroke="currentColor" strokeWidth="2" />
        <path d="M 20 0 L 10 0" stroke="currentColor" strokeWidth="2" />
        
        {/* Triangle */}
        <path d="M -10 -15 L -10 15 L 10 0 Z" fill="#333" stroke="currentColor" strokeWidth="2" />
        
        {/* Line */}
        <line x1="10" y1="-15" x2="10" y2="15" stroke="currentColor" strokeWidth="3" />
    </g>
);

const ZenerDiodeSVG = () => (
    <g>
        <path d="M -20 0 L -10 0" stroke="currentColor" strokeWidth="2" />
        <path d="M 20 0 L 10 0" stroke="currentColor" strokeWidth="2" />
        
        {/* Triangle */}
        <path d="M -10 -15 L -10 15 L 10 0 Z" fill="#333" stroke="currentColor" strokeWidth="2" />
        
        {/* Zener Line (Z shape) */}
        <path d="M 10 -15 L 10 15" stroke="currentColor" strokeWidth="3" />
        <path d="M 10 -15 L 5 -20" stroke="currentColor" strokeWidth="3" />
        <path d="M 10 15 L 15 20" stroke="currentColor" strokeWidth="3" />
    </g>
);

const TransistorSVG: React.FC<{ type: 'NPN' | 'PNP' }> = ({ type }) => (
    <g>
        <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="-20" y1="0" x2="-10" y2="0" stroke="currentColor" strokeWidth="2" /> {/* Base Wire */}
        <line x1="-10" y1="-12" x2="-10" y2="12" stroke="currentColor" strokeWidth="3" /> {/* Base Bar */}
        
        <line x1="-10" y1="-5" x2="10" y2="-15" stroke="currentColor" strokeWidth="2" /> {/* Collector Internal */}
        <line x1="10" y1="-15" x2="20" y2="-20" stroke="currentColor" strokeWidth="2" /> {/* Collector Wire */}

        <line x1="-10" y1="5" x2="10" y2="15" stroke="currentColor" strokeWidth="2" /> {/* Emitter Internal */}
        <line x1="10" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="2" /> {/* Emitter Wire */}

        {/* Arrow */}
        {type === 'NPN' ? (
            <path d="M 5 13 L 10 15 L 6 9" fill="currentColor" stroke="none" /> // Outward on Emitter
        ) : (
            <path d="M 2 8 L -4 4 L 4 2" fill="currentColor" stroke="none" transform="translate(0, 5)" /> // Inward (rough approx visual)
        )}
    </g>
);

const LEDSVG: React.FC<{ isOn: boolean; brightness?: number; color?: string }> = ({ isOn, brightness = 1, color = 'red' }) => {
    const hexColor = LED_COLORS[color] || LED_COLORS['red'];
    
    return (
      <g>
        <path d="M -20 0 L -10 0" stroke="currentColor" strokeWidth="2" />
        <path d="M 20 0 L 10 0" stroke="currentColor" strokeWidth="2" />
        
        <circle 
            cx="0" cy="0" r="25" 
            fill="url(#led-glow-strong)" 
            className={`transition-opacity duration-300 pointer-events-none`}
            style={{ opacity: isOn ? brightness * 0.6 : 0, fill: hexColor }} 
        />

        <path 
            d="M -10 -10 L -10 10 L 10 0 Z" 
            fill={isOn ? hexColor : "#374151"} 
            stroke={isOn ? hexColor : "currentColor"} 
            strokeWidth="2" 
            filter={isOn ? "url(#led-glow)" : ""}
            className="transition-all duration-300"
            style={{ fillOpacity: isOn ? 0.5 + (brightness * 0.5) : 1 }}
        />
        
        <line x1="10" y1="-10" x2="10" y2="10" stroke="currentColor" strokeWidth="2" />
        
        <g className={`transition-opacity duration-300`} style={{ opacity: isOn ? brightness : 0 }}>
            <path d="M 0 -15 L 5 -22" stroke={hexColor} strokeWidth="2" />
            <path d="M 5 -12 L 12 -18" stroke={hexColor} strokeWidth="2" />
        </g>
        <g className={`transition-opacity duration-300 ${isOn ? 'opacity-20' : 'opacity-100'}`}>
            <path d="M 0 -15 L 10 -25 M 5 -15 L 15 -25" stroke="currentColor" strokeWidth="1" />
        </g>
      </g>
    );
};

const VoltageSourceSVG = () => (
  <g>
    <path d="M 0 -30 L 0 -15" stroke="currentColor" strokeWidth="2" />
    <path d="M 0 30 L 0 15" stroke="currentColor" strokeWidth="2" />
    <circle cx="0" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
    <text x="0" y="5" textAnchor="middle" fontSize="16" fill="currentColor" fontWeight="bold">V</text>
    <text x="10" y="-20" fontSize="10" fill="currentColor">+</text>
  </g>
);

const ACSourceSVG = () => (
  <g>
    <path d="M 0 -30 L 0 -15" stroke="currentColor" strokeWidth="2" />
    <path d="M 0 30 L 0 15" stroke="currentColor" strokeWidth="2" />
    <circle cx="0" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Sine wave approx */}
    <path d="M -8 2 Q -4 -5 0 0 T 8 -2" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(-45)" />
  </g>
);

const GroundSVG = () => (
  <g>
    <line x1="0" y1="-20" x2="0" y2="0" stroke="currentColor" strokeWidth="2" />
    <line x1="-15" y1="0" x2="15" y2="0" stroke="currentColor" strokeWidth="2" />
    <line x1="-10" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="2" />
    <line x1="-5" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="2" />
  </g>
);

const SwitchSVG: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <g>
    <circle cx="-30" cy="0" r="3" fill="currentColor" />
    <circle cx="30" cy="0" r="3" fill="currentColor" />
    <line
      x1="-30" y1="0" x2="25" y2={isOpen ? -20 : 0}
      stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      className="transition-all duration-300"
    />
  </g>
);

const LogicGateSVG: React.FC<{ type: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' }> = ({ type }) => {
  const Bubble = () => <circle cx="44" cy="0" r="4" stroke="currentColor" strokeWidth="2" fill="none" />;
  
  if (type === 'AND' || type === 'NAND') {
    return (
      <g>
        <path d="M -40 -15 L -20 -15" stroke="currentColor" strokeWidth="2" />
        <path d="M -40 15 L -20 15" stroke="currentColor" strokeWidth="2" />
        <path d={`M ${type === 'NAND' ? 48 : 20} 0 L 60 0`} stroke="currentColor" strokeWidth="2" />
        <path d="M -20 -25 L 0 -25 Q 20 -25 20 0 Q 20 25 0 25 L -20 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        {type === 'NAND' && <Bubble />}
      </g>
    );
  }
  if (type === 'OR' || type === 'NOR') {
    return (
      <g>
        <path d="M -40 -15 L -15 -15" stroke="currentColor" strokeWidth="2" />
        <path d="M -40 15 L -15 15" stroke="currentColor" strokeWidth="2" />
        <path d={`M ${type === 'NOR' ? 48 : 20} 0 L 60 0`} stroke="currentColor" strokeWidth="2" />
        <path d="M -20 -25 Q 10 -25 20 0 Q 10 25 -20 25 Q -10 0 -20 -25" fill="none" stroke="currentColor" strokeWidth="2" />
        {type === 'NOR' && <Bubble />}
      </g>
    );
  }
  if (type === 'XOR') {
      return (
        <g>
            <path d="M -40 -15 L -25 -15" stroke="currentColor" strokeWidth="2" />
            <path d="M -40 15 L -25 15" stroke="currentColor" strokeWidth="2" />
            <path d="M 20 0 L 40 0" stroke="currentColor" strokeWidth="2" />
            {/* First Curve */}
            <path d="M -30 -25 Q -20 0 -30 25" fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Body */}
            <path d="M -20 -25 Q 10 -25 20 0 Q 10 25 -20 25 Q -10 0 -20 -25" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>
      );
  }
  // NOT
  return (
    <g>
      <path d="M -40 0 L -20 0" stroke="currentColor" strokeWidth="2" />
      <path d="M 48 0 L 60 0" stroke="currentColor" strokeWidth="2" />
      <path d="M -20 -20 L 40 0 L -20 20 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <Bubble />
    </g>
  );
};

const MicrocontrollerSVG = () => (
    <g>
        <rect x="-30" y="-50" width="60" height="100" rx="4" fill="#334155" stroke="currentColor" strokeWidth="2"/>
        <text x="0" y="5" textAnchor="middle" fontSize="10" fill="white" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>MCU</text>
    </g>
)

const IC555SVG = () => (
    <g>
        {/* Legs - Draw before body so they look attached behind or seamless */}
        {/* Left Legs */}
        <line x1="-60" y1="-30" x2="-40" y2="-30" stroke="currentColor" strokeWidth="2" />
        <line x1="-60" y1="-10" x2="-40" y2="-10" stroke="currentColor" strokeWidth="2" />
        <line x1="-60" y1="10" x2="-40" y2="10" stroke="currentColor" strokeWidth="2" />
        <line x1="-60" y1="30" x2="-40" y2="30" stroke="currentColor" strokeWidth="2" />
        
        {/* Right Legs */}
        <line x1="60" y1="-30" x2="40" y2="-30" stroke="currentColor" strokeWidth="2" />
        <line x1="60" y1="-10" x2="40" y2="-10" stroke="currentColor" strokeWidth="2" />
        <line x1="60" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="2" />
        <line x1="60" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="2" />

        {/* DIP-8 Body */}
        <rect x="-40" y="-45" width="80" height="90" rx="4" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
        
        {/* Notch */}
        <path d="M -10 -45 Q 0 -35 10 -45" stroke="currentColor" strokeWidth="1" fill="none" />
        
        {/* Central Label */}
        <text x="0" y="5" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold" opacity="0.3">555</text>
        
        {/* Pin Labels (Internal) - Always visible for clarity */}
        {/* Left Side */}
        <text x="-35" y="-27" fontSize="9" fill="#94a3b8" textAnchor="start" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>1 GND</text>
        <text x="-35" y="-7"  fontSize="9" fill="#94a3b8" textAnchor="start" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>2 TRG</text>
        <text x="-35" y="13"  fontSize="9" fill="#94a3b8" textAnchor="start" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>3 OUT</text>
        <text x="-35" y="33"  fontSize="9" fill="#94a3b8" textAnchor="start" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>4 RST</text>
        
        {/* Right Side */}
        <text x="35" y="-27" fontSize="9" fill="#94a3b8" textAnchor="end" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>8 VCC</text>
        <text x="35" y="-7"  fontSize="9" fill="#94a3b8" textAnchor="end" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>7 DIS</text>
        <text x="35" y="13"  fontSize="9" fill="#94a3b8" textAnchor="end" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>6 THR</text>
        <text x="35" y="33"  fontSize="9" fill="#94a3b8" textAnchor="end" alignmentBaseline="middle" fontWeight="bold" style={{fontSize: '8px'}}>5 CV</text>
    </g>
)

const MultimeterSVG: React.FC<{ value: string; mode: string; onModeChange?: (m: string) => void }> = ({ value, mode, onModeChange }) => {
    // Colors for the new design
    const bumperColor = "#f59e0b"; // Amber/Orange
    const faceColor = "#1e293b"; // Dark slate
    const screenColor = "#e2e8f0"; // Light grey/greenish
    const buttonInactive = "#334155";
    const buttonActive = "#38bdf8"; 
    const textColor = "#0f172a";

    const isVolt = mode === 'V';
    const isOhm = mode === 'OHM';
    const isAmp = mode === 'A';

    return (
        <g>
            {/* Outer Bumper (Orange Case) - Widen to 135px (1.5x of 90) */}
            <rect x="-67.5" y="-45" width="135" height="90" rx="12" fill={bumperColor} stroke="#b45309" strokeWidth="3" />
            
            {/* Inner Face - Widen to 121px */}
            <rect x="-60.5" y="-38" width="121" height="76" rx="8" fill={faceColor} />

            {/* Buttons Row - Clickable - Spaced out more */}
            <g transform="translate(0, -34)">
                {/* VOLT Button - Left */}
                <g 
                    transform="translate(-47, 0)" 
                    onClick={(e) => { e.stopPropagation(); onModeChange && onModeChange('V'); }} 
                    onMouseDown={(e) => e.stopPropagation()}
                    className="cursor-pointer hover:opacity-80"
                >
                    <rect x="0" y="0" width="24" height="12" rx="2" fill={isVolt ? buttonActive : buttonInactive} stroke="none" />
                    <text x="12" y="9" textAnchor="middle" fontSize="8" fill={isVolt ? "black" : "white"} fontWeight="bold">V</text>
                </g>

                {/* OHM Button - Center */}
                <g 
                    transform="translate(-12, 0)" 
                    onClick={(e) => { e.stopPropagation(); onModeChange && onModeChange('OHM'); }} 
                    onMouseDown={(e) => e.stopPropagation()}
                    className="cursor-pointer hover:opacity-80"
                >
                    <rect x="0" y="0" width="24" height="12" rx="2" fill={isOhm ? buttonActive : buttonInactive} stroke="none" />
                    <text x="12" y="9" textAnchor="middle" fontSize="8" fill={isOhm ? "black" : "white"} fontWeight="bold">Ω</text>
                </g>

                {/* AMP Button - Right */}
                <g 
                    transform="translate(23, 0)" 
                    onClick={(e) => { e.stopPropagation(); onModeChange && onModeChange('A'); }} 
                    onMouseDown={(e) => e.stopPropagation()}
                    className="cursor-pointer hover:opacity-80"
                >
                    <rect x="0" y="0" width="24" height="12" rx="2" fill={isAmp ? buttonActive : buttonInactive} stroke="none" />
                    <text x="12" y="9" textAnchor="middle" fontSize="8" fill={isAmp ? "black" : "white"} fontWeight="bold">A</text>
                </g>
            </g>

            {/* Large LCD Screen - Widen to 96px (1.5x of 64) */}
            <rect x="-48" y="-18" width="96" height="34" rx="2" fill={screenColor} stroke="#94a3b8" strokeWidth="1" />
            
            <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontSize="20" fill={textColor} fontWeight="bold" letterSpacing="1px">
                {value === '---' ? '- - -' : value}
            </text>
             <text x="44" y="12" textAnchor="end" fontSize="8" fill="#64748b" fontWeight="bold">
                {mode === 'OFF' ? '' : mode}
            </text>

            {/* Ports - Widen separation */}
            <g transform="translate(0, 26)">
                {/* Red Port */}
                <circle cx="-30" cy="0" r="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
                <circle cx="-30" cy="0" r="2" fill="#1e293b" />
                
                {/* COM/Blue Port */}
                <circle cx="30" cy="0" r="5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
                <circle cx="30" cy="0" r="2" fill="#1e293b" />
                
                <rect x="-6" y="-3" width="12" height="6" fill="#0f172a" rx="1" />
            </g>
        </g>
    );
};

export const ComponentRenderer: React.FC<Props> = ({ component, isSelected, onEdit, onModeChange, showLabels }) => {
  const renderContent = () => {
    switch (component.type) {
      case ComponentType.Resistor: return <ResistorSVG bands={component.properties.bands} />;
      case ComponentType.Potentiometer: return <PotentiometerSVG />;
      case ComponentType.Capacitor: return <CapacitorSVG isElectrolytic={component.properties.isElectrolytic} />;
      case ComponentType.TransistorNPN: return <TransistorSVG type="NPN" />;
      case ComponentType.TransistorPNP: return <TransistorSVG type="PNP" />;
      case ComponentType.LED: return <LEDSVG isOn={!!component.properties.isOn} brightness={component.properties.brightness} color={component.properties.color} />;
      case ComponentType.Diode: return <DiodeSVG />;
      case ComponentType.ZenerDiode: return <ZenerDiodeSVG />;
      case ComponentType.IC555: return <IC555SVG />;
      case ComponentType.VoltageSource: return <VoltageSourceSVG />;
      case ComponentType.ACSource: return <ACSourceSVG />;
      case ComponentType.Ground: return <GroundSVG />;
      case ComponentType.Switch: return <SwitchSVG isOpen={component.properties.isOpen !== false} />;
      case ComponentType.ANDGate: return <LogicGateSVG type="AND" />;
      case ComponentType.ORGate: return <LogicGateSVG type="OR" />;
      case ComponentType.NOTGate: return <LogicGateSVG type="NOT" />;
      case ComponentType.NANDGate: return <LogicGateSVG type="NAND" />;
      case ComponentType.NORGate: return <LogicGateSVG type="NOR" />;
      case ComponentType.XORGate: return <LogicGateSVG type="XOR" />;
      case ComponentType.Microcontroller: return <MicrocontrollerSVG />;
      case ComponentType.Multimeter: 
        return <MultimeterSVG 
            value={component.properties.displayValue || "---"} 
            mode={component.properties.mode || "OFF"} 
            onModeChange={onModeChange}
        />;
      default: return <rect x="-20" y="-20" width="40" height="40" stroke="currentColor" fill="none" />;
    }
  };

  const pins = COMPONENT_PINS[component.type] || [];
  const canEdit = component.type === ComponentType.Resistor || component.type === ComponentType.Switch || component.type === ComponentType.LED || component.type === ComponentType.Multimeter || component.type === ComponentType.Capacitor || component.type === ComponentType.ACSource || component.type === ComponentType.Potentiometer || component.type === ComponentType.IC555;
  const isToggleable = component.type === ComponentType.Switch || component.type === ComponentType.LED;

  const isLarge = component.type === ComponentType.Multimeter && component.properties.size === 'large';
  const scale = isLarge ? 2 : 1;

  // Component ID Label Logic
  const getComponentLabel = () => {
      // Very simple unique ID based logic for demo (e.g. first 2 chars of ID) or Type
      // Ideally should be "R1", "C2" etc via prop, but using shortened Type or Value here
      if (component.type === ComponentType.Resistor) return formatResistance(calculateResistance(component.properties.bands));
      if (component.type === ComponentType.Capacitor) return formatCapacitance(component.properties.capacitance || 0);
      if (component.type === ComponentType.VoltageSource) return "V_SRC";
      if (component.type === ComponentType.IC555) return "NE555";
      return "";
  };

  // Pin Label Map for readable names
  const getPinLabel = (id: string) => {
      const map: Record<string, string> = {
          'p1': '1', 'p2': '2',
          'anode': '+', 'cathode': '-',
          'pos': '+', 'neg': '-',
          'gnd': 'GND',
          'in': 'IN', 'out': 'OUT',
          'vcc': 'VCC', 'trig': 'TRIG', 'dis': 'DIS', 'thr': 'THR', 'ctrl': 'CTRL', 'rst': 'RST',
          'c': 'C', 'b': 'B', 'e': 'E',
          'red': '+', 'black': '-'
      };
      return map[id] || id;
  };

  return (
    <g transform={`translate(${component.x}, ${component.y}) rotate(${component.rotation})`}>
      {isSelected && (
          <rect 
          x="-50" y="-60" width="100" height="120" 
          fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeDasharray="4 2" rx="5" pointerEvents="none"
          transform={`scale(${scale})`}
          />
      )}
      
      {/* Component Graphic (CurrentColor inherits from parent) */}
      <g className="transition-all duration-200" transform={`scale(${scale})`}>
        {renderContent()}
      </g>

      {/* Main Component Label */}
      {showLabels && (
          <g transform={`rotate(${-component.rotation})`}>
              <text 
                x="0" 
                y="-55" 
                textAnchor="middle" 
                fontSize="10" 
                fill="#94a3b8" 
                className="pointer-events-none select-none font-mono"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}
              >
                  {getComponentLabel()}
              </text>
          </g>
      )}

      {isSelected && (
        <g transform={`scale(${scale})`}>
            {canEdit && (
                <g 
                    transform="translate(40, -50) rotate(0)" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit && onEdit(); }}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="cursor-pointer hover:opacity-80"
                >
                    <circle r="12" fill={isToggleable ? "#4ade80" : "#38bdf8"} />
                    <g transform="translate(-8, -8)">
                        {isToggleable ? <Power size={16} color="black" /> : <Settings size={16} color="black" />}
                    </g>
                </g>
            )}
        </g>
      )}

      {pins.map(pin => (
        <g key={pin.id}>
            {/* The Pin Circle */}
            <circle 
            cx={pin.x * scale} cy={pin.y * scale} r="5" 
            fill={isSelected ? '#38bdf8' : (pin.id === 'red' ? '#ef4444' : (pin.id === 'black' ? '#1e293b' : 'transparent'))}
            stroke={pin.id === 'black' ? '#64748b' : 'none'} strokeWidth="1"
            className="hover:fill-lab-accent cursor-crosshair"
            data-pin-id={pin.id} 
            />
            
            {/* The Pin Label Text */}
            {showLabels && (
                // Counter-rotate text so it's always upright
                <g transform={`translate(${pin.x * scale}, ${pin.y * scale})`}>
                    <text 
                        x="0" 
                        y={pin.y < 0 ? -12 : 18} // Offset above or below pin based on position relative to center
                        textAnchor="middle" 
                        fontSize="8" 
                        fill="#cbd5e1" 
                        className="pointer-events-none select-none font-bold"
                        transform={`rotate(${-component.rotation})`}
                    >
                        {getPinLabel(pin.id)}
                    </text>
                </g>
            )}
        </g>
      ))}
    </g>
  );
};
