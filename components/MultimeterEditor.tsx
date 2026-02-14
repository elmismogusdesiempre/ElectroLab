
import React from 'react';
import { TRANSLATIONS } from '../constants';

interface Props {
  size: 'standard' | 'large';
  onChange: (size: 'standard' | 'large') => void;
  onClose: () => void;
  lang: 'en' | 'es';
}

export const MultimeterEditor: React.FC<Props> = ({ size, onChange, onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="absolute top-20 right-4 bg-lab-panel border border-slate-600 p-4 rounded-lg shadow-xl z-50 w-64 flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">{t.multimeterSettings || "Multimeter Settings"}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>

      <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 block mb-2">{t.size || "Size"}</label>
          <div className="flex bg-slate-900 rounded p-1">
              <button 
                onClick={() => onChange('standard')}
                className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${size !== 'large' ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
              >
                  {t.standard || "Standard"}
              </button>
              <button 
                onClick={() => onChange('large')}
                className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${size === 'large' ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
              >
                  {t.large || "Large"}
              </button>
          </div>
      </div>
      
    </div>
  );
};
