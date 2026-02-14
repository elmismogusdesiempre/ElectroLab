
import React, { useState } from 'react';
import { ComponentType } from '../types';
import { TRANSLATIONS } from '../constants';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  onAdd: (type: ComponentType) => void;
  lang: 'en' | 'es';
  theme: 'dark' | 'light';
}

// --- Custom Schematic Icons ---
const IconSvg = ({ children }: { children?: React.ReactNode }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const Icons = {
    Resistor: () => <IconSvg><path d="M2 12h4l2-4 4 8 4-8 2 4h4" /></IconSvg>,
    Potentiometer: () => <IconSvg><path d="M2 12h4l2-4 4 8 4-8 2 4h4" /><path d="M12 5v4l-3-2 3 2 3-2" /></IconSvg>,
    Capacitor: () => <IconSvg><path d="M2 12h8" /><path d="M14 12h8" /><path d="M10 7v10" /><path d="M14 7v10" /></IconSvg>,
    SourceDC: () => <IconSvg><path d="M12 2v20" /><path d="M2 8h20" /><path d="M6 16h12" /></IconSvg>,
    SourceAC: () => <IconSvg><circle cx="12" cy="12" r="10" /><path d="M8 12s1.5-3 4-3 4 3 4 3" /></IconSvg>,
    Ground: () => <IconSvg><path d="M12 4v8" /><path d="M4 12h16" /><path d="M6 16h12" /><path d="M8 20h8" /></IconSvg>,
    Diode: () => <IconSvg><path d="M2 12h7" /><path d="M15 12h7" /><path d="M9 7l6 5-6 5z" /><path d="M15 7v10" /></IconSvg>,
    Zener: () => <IconSvg><path d="M2 12h7" /><path d="M15 12h7" /><path d="M9 7l6 5-6 5z" /><path d="M15 7v10l2-2" /><path d="M15 17l-2 2" /></IconSvg>,
    NPN: () => <IconSvg><circle cx="12" cy="12" r="10" /><path d="M12 12h-5" /><path d="M12 12v-5" /><path d="M12 12l4 4" /><path d="M14 16l2-1" /></IconSvg>, // Simplified
    PNP: () => <IconSvg><circle cx="12" cy="12" r="10" /><path d="M12 12h-5" /><path d="M12 12v-5" /><path d="M12 12l4 4" /><path d="M14 14l-2 1" /></IconSvg>,
    LED: () => <IconSvg><path d="M2 12h7" /><path d="M15 12h7" /><path d="M9 7l6 5-6 5z" /><path d="M15 7v10" /><path d="M5 5l3 3" /><path d="M8 5l3 3" /></IconSvg>,
    Switch: () => <IconSvg><path d="M4 12h4" /><path d="M16 12h4" /><path d="M8 12l8-6" /></IconSvg>,
    GateAND: () => <IconSvg><path d="M2 8h5" /><path d="M2 16h5" /><path d="M17 12h5" /><path d="M7 5v14c6 0 10-3 10-7s-4-7-10-7z" /></IconSvg>,
    GateOR: () => <IconSvg><path d="M2 8h5" /><path d="M2 16h5" /><path d="M17 12h5" /><path d="M7 5c2 4 2 10 0 14 8 0 10-4 10-7s-2-7-10-7z" /></IconSvg>,
    GateNOT: () => <IconSvg><path d="M2 12h6" /><path d="M18 12h4" /><path d="M8 7l10 5-10 5z" /><circle cx="19" cy="12" r="1" /></IconSvg>,
    GateNAND: () => <IconSvg><path d="M2 8h5" /><path d="M2 16h5" /><path d="M18 12h4" /><path d="M7 5v14c6 0 10-3 10-7s-4-7-10-7z" /><circle cx="17.5" cy="12" r="1.5" /></IconSvg>,
    GateNOR: () => <IconSvg><path d="M2 8h5" /><path d="M2 16h5" /><path d="M18 12h4" /><path d="M7 5c2 4 2 10 0 14 8 0 10-4 10-7s-2-7-10-7z" /><circle cx="17.5" cy="12" r="1.5" /></IconSvg>,
    GateXOR: () => <IconSvg><path d="M2 8h2" /><path d="M2 16h2" /><path d="M17 12h5" /><path d="M4 5c2 4 2 10 0 14" /><path d="M7 5c2 4 2 10 0 14 8 0 10-4 10-7s-2-7-10-7z" /></IconSvg>,
    MCU: () => <IconSvg><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 2v4" /><path d="M12 2v4" /><path d="M16 2v4" /><path d="M8 18v4" /></IconSvg>,
    IC555: () => <IconSvg><rect x="4" y="4" width="16" height="16" rx="2" /><text x="12" y="16" fontSize="8" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold">555</text></IconSvg>
};

export const Toolbox: React.FC<Props> = ({ onAdd, lang, theme }) => {
  const t = TRANSLATIONS[lang];
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
      'sources': true,
      'passive': true,
      'semicon': true,
      'logic': false,
      'io': false
  });

  const toggle = (cat: string) => {
      setOpenCategories(prev => ({...prev, [cat]: !prev[cat]}));
  };

  // Group definitions
  const categories = [
      {
          id: 'sources',
          label: t.categories.sources,
          icon: <Icons.SourceDC />,
          items: [
              { type: ComponentType.VoltageSource, label: t.components.dcSource, icon: <Icons.SourceDC /> },
              { type: ComponentType.ACSource, label: t.components.acSource, icon: <Icons.SourceAC /> },
              { type: ComponentType.Ground, label: t.components.ground, icon: <Icons.Ground /> }
          ]
      },
      {
          id: 'passive',
          label: t.categories.passive,
          icon: <Icons.Resistor />,
          items: [
              { type: ComponentType.Resistor, label: t.components.resistor, icon: <Icons.Resistor /> },
              { type: ComponentType.Potentiometer, label: t.components.potentiometer, icon: <Icons.Potentiometer /> },
              { type: ComponentType.Capacitor, label: t.components.capacitor, icon: <Icons.Capacitor /> }
          ]
      },
      {
          id: 'semicon',
          label: t.categories.semicon,
          icon: <Icons.Diode />,
          items: [
              { type: ComponentType.IC555, label: t.components.ic555, icon: <Icons.IC555 /> },
              { type: ComponentType.Diode, label: t.components.diode, icon: <Icons.Diode /> },
              { type: ComponentType.ZenerDiode, label: t.components.zener, icon: <Icons.Zener /> },
              { type: ComponentType.TransistorNPN, label: t.components.transistorNPN, icon: <Icons.NPN /> },
              { type: ComponentType.TransistorPNP, label: t.components.transistorPNP, icon: <Icons.PNP /> },
              { type: ComponentType.LED, label: t.components.led, icon: <Icons.LED /> },
          ]
      },
      {
          id: 'logic',
          label: t.categories.logic,
          icon: <Icons.GateAND />,
          items: [
              { type: ComponentType.ANDGate, label: t.components.and, icon: <Icons.GateAND /> },
              { type: ComponentType.ORGate, label: t.components.or, icon: <Icons.GateOR /> },
              { type: ComponentType.NOTGate, label: t.components.not, icon: <Icons.GateNOT /> },
              { type: ComponentType.NANDGate, label: t.components.nand, icon: <Icons.GateNAND /> },
              { type: ComponentType.NORGate, label: t.components.nor, icon: <Icons.GateNOR /> },
              { type: ComponentType.XORGate, label: t.components.xor, icon: <Icons.GateXOR /> },
          ]
      },
      {
          id: 'io',
          label: t.categories.io,
          icon: <Icons.Switch />,
          items: [
              { type: ComponentType.Switch, label: t.components.switch, icon: <Icons.Switch /> },
              { type: ComponentType.Microcontroller, label: t.components.mcu, icon: <Icons.MCU /> },
          ]
      }
  ];

  return (
    <div className={`w-48 border-r flex flex-col z-10 overflow-y-auto custom-scrollbar ${theme === 'dark' ? 'bg-lab-panel border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className={`p-3 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
        {t.categories.tools}
      </div>
      
      {categories.map((cat) => (
        <div key={cat.id} className="border-b border-slate-700/50">
            <button 
                onClick={() => toggle(cat.id)}
                className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
                <div className="flex items-center gap-2">
                    <div className="text-current scale-75">{cat.icon}</div>
                    <span>{cat.label}</span>
                </div>
                {openCategories[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {openCategories[cat.id] && (
                <div className={`bg-black/10 grid grid-cols-2 gap-1 p-2`}>
                    {cat.items.map((item) => (
                        <button
                            key={item.type}
                            onClick={() => onAdd(item.type)}
                            className={`flex flex-col items-center justify-center p-2 rounded gap-1 transition-all text-xs text-center h-20 ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-black hover:bg-slate-200'}`}
                            title={item.label}
                        >
                            <div className={`${theme === 'dark' ? 'text-lab-accent' : 'text-blue-600'}`}>{item.icon}</div>
                            <span className="leading-tight line-clamp-2 scale-90">{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
      ))}
    </div>
  );
};
