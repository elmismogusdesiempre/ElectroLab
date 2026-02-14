
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { formatResistance } from '../utils/circuitUtils';

interface Props {
  totalResistance: number;
  wiperPosition: number; // 0-100
  onChange: (totalResistance: number, wiperPosition: number) => void;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const PotentiometerEditor: React.FC<Props> = ({ totalResistance, wiperPosition, onChange, onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="absolute top-20 right-4 bg-lab-panel border border-slate-600 p-4 rounded-lg shadow-xl z-50 w-72 flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">{t.potentiometerSettings || "Potentiometer Settings"}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>

      {/* Wiper Position Slider */}
      <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-300">{t.wiperPosition || "Wiper Position (%)"}</label>
            <span className="text-xs font-mono text-lab-accent">{wiperPosition.toFixed(0)}%</span>
          </div>
          
          <input 
              type="range" 
              min="0" 
              max="100" 
              step="1"
              value={wiperPosition}
              onChange={(e) => onChange(totalResistance, parseFloat(e.target.value) || 0)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-lab-accent"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
             <span>0% (Left)</span>
             <span>100% (Right)</span>
          </div>
      </div>

      {/* Total Resistance */}
      <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 block mb-1">{t.totalResistance || "Total Resistance (Ω)"}</label>
          <div className="flex items-center gap-2">
              <input 
                  type="number" 
                  min="0" 
                  step="100"
                  value={totalResistance}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0, wiperPosition)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:border-lab-accent focus:outline-none"
              />
              <span className="text-slate-400 text-xs">Ω</span>
          </div>
      </div>
      
      {/* Quick Presets */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-700">
          {[1000, 5000, 10000, 50000, 100000].map(val => (
            <button 
                key={val}
                onClick={() => onChange(val, wiperPosition)} 
                className="bg-slate-700 hover:bg-slate-600 text-[10px] py-1.5 rounded text-slate-200 transition-colors"
            >
                {formatResistance(val)}
            </button>
          ))}
      </div>

    </div>
  );
};
