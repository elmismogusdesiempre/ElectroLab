
import React from 'react';
import { TRANSLATIONS } from '../constants';

interface Props {
  capacitance: number; // in microfarads
  isElectrolytic: boolean;
  onChange: (capacitance: number, isElectrolytic: boolean) => void;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const CapacitorEditor: React.FC<Props> = ({ capacitance, isElectrolytic, onChange, onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="absolute top-20 right-4 bg-lab-panel border border-slate-600 p-4 rounded-lg shadow-xl z-50 w-72 flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">{t.capacitorSettings}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>

      {/* Type Selection */}
      <div className="flex bg-slate-900 rounded p-1 mb-4">
          <button 
            onClick={() => onChange(capacitance, false)}
            className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${!isElectrolytic ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
          >
              {lang === 'es' ? 'Cerámico' : 'Ceramic'}
          </button>
          <button 
            onClick={() => onChange(capacitance, true)}
            className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${isElectrolytic ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
          >
              {lang === 'es' ? 'Electrolítico' : 'Electrolytic'}
          </button>
      </div>

      {/* Value Input */}
      <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 block mb-1">{t.capacitance}</label>
          <div className="flex items-center gap-2">
              <input 
                  type="number" 
                  min="0.000001" 
                  step="0.1"
                  value={capacitance}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0, isElectrolytic)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:border-lab-accent focus:outline-none"
              />
              <span className="text-slate-400">µF</span>
          </div>
      </div>
      
      {/* Helper preset buttons */}
      <div className="grid grid-cols-3 gap-2">
          {[0.1, 1, 10, 100, 470, 1000].map(val => (
              <button 
                key={val}
                onClick={() => onChange(val, isElectrolytic)}
                className="bg-slate-700 hover:bg-slate-600 text-xs py-1 rounded text-slate-200"
              >
                  {val} µF
              </button>
          ))}
      </div>

    </div>
  );
};
