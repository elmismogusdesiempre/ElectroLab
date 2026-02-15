
import React from 'react';
import { TRANSLATIONS } from '../constants';

interface Props {
  onClose: () => void;
  lang: 'en' | 'es';
}

export const IC555Pinout: React.FC<Props> = ({ onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  const pins = [
      { id: 1, name: "GND", desc: t.pinDesc.gnd },
      { id: 2, name: "TRIG", desc: t.pinDesc.trig },
      { id: 3, name: "OUT", desc: t.pinDesc.out },
      { id: 4, name: "RESET", desc: t.pinDesc.rst },
      { id: 8, name: "VCC", desc: t.pinDesc.vcc },
      { id: 7, name: "DIS", desc: t.pinDesc.dis },
      { id: 6, name: "THR", desc: t.pinDesc.thr },
      { id: 5, name: "CTRL", desc: t.pinDesc.ctrl }
  ];

  return (
    <div className="absolute top-20 right-4 bg-lab-panel border border-slate-600 p-4 rounded-lg shadow-xl z-50 w-80 flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">{t.ic555Pinout}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>

      <div className="flex justify-center mb-6">
          <div className="relative w-32 h-40 bg-slate-800 border-2 border-slate-500 rounded-lg flex items-center justify-center shadow-inner">
              <div className="absolute top-0 w-4 h-4 rounded-full bg-slate-900 -mt-2"></div>
              <div className="text-2xl font-bold text-slate-500">555</div>
              
              {/* Left Pins */}
              <div className="absolute -left-2 top-4 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -left-6 top-4 text-xs font-mono text-white">1</div>
              
              <div className="absolute -left-2 top-12 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -left-6 top-12 text-xs font-mono text-white">2</div>

              <div className="absolute -left-2 top-20 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -left-6 top-20 text-xs font-mono text-white">3</div>

              <div className="absolute -left-2 top-28 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -left-6 top-28 text-xs font-mono text-white">4</div>

              {/* Right Pins */}
              <div className="absolute -right-2 top-4 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -right-6 top-4 text-xs font-mono text-white">8</div>

              <div className="absolute -right-2 top-12 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -right-6 top-12 text-xs font-mono text-white">7</div>

              <div className="absolute -right-2 top-20 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -right-6 top-20 text-xs font-mono text-white">6</div>

              <div className="absolute -right-2 top-28 w-2 h-4 bg-slate-400"></div>
              <div className="absolute -right-6 top-28 text-xs font-mono text-white">5</div>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs">
          {pins.map(p => (
              <div key={p.id} className="flex gap-2">
                  <span className="font-mono font-bold text-lab-accent w-4">{p.id}</span>
                  <span className="font-bold text-white w-10">{p.name}</span>
                  <span className="text-slate-400">{p.desc}</span>
              </div>
          ))}
      </div>
    </div>
  );
};
