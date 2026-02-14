
import React from 'react';
import { TRANSLATIONS } from '../constants';

interface Props {
  voltage: number;
  frequency: number;
  onChange: (voltage: number, frequency: number) => void;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const ACSourceEditor: React.FC<Props> = ({ voltage, frequency, onChange, onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="absolute top-20 right-4 bg-lab-panel border border-slate-600 p-4 rounded-lg shadow-xl z-50 w-72 flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">{t.acSourceSettings || "AC Source Settings"}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>

      {/* Voltage Control */}
      <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-300">{t.peakVoltage || "Peak Voltage (V)"}</label>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
              <input 
                  type="number" 
                  min="0" 
                  max="500"
                  step="1"
                  value={voltage}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0, frequency)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white focus:border-lab-accent focus:outline-none"
              />
              <span className="text-slate-400 text-xs">V</span>
          </div>
          
          <input 
              type="range" 
              min="0" 
              max="240" 
              step="1"
              value={voltage}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0, frequency)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-lab-accent"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
             <span>0V</span>
             <span>120V</span>
             <span>240V</span>
          </div>
      </div>

      {/* Frequency Control */}
      <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-300">{t.frequency || "Frequency (Hz)"}</label>
          </div>

          <div className="flex items-center gap-2 mb-2">
              <input 
                  type="number" 
                  min="0" 
                  max="20000"
                  step="1"
                  value={frequency}
                  onChange={(e) => onChange(voltage, parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white focus:border-lab-accent focus:outline-none"
              />
              <span className="text-slate-400 text-xs">Hz</span>
          </div>

          <input 
              type="range" 
              min="1" 
              max="1000" 
              step="1"
              value={frequency}
              onChange={(e) => onChange(voltage, parseFloat(e.target.value) || 0)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-lab-accent"
          />
           <div className="flex justify-between text-[10px] text-slate-500 mt-1">
             <span>1Hz</span>
             <span>500Hz</span>
             <span>1kHz</span>
          </div>
      </div>
      
      {/* Quick Presets */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-slate-700">
          <button onClick={() => onChange(120, 60)} className="bg-slate-700 hover:bg-slate-600 text-xs py-1.5 rounded text-slate-200 transition-colors">
            120V / 60Hz
          </button>
          <button onClick={() => onChange(220, 50)} className="bg-slate-700 hover:bg-slate-600 text-xs py-1.5 rounded text-slate-200 transition-colors">
            220V / 50Hz
          </button>
      </div>

    </div>
  );
};
