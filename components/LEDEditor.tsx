
import React from 'react';
import { TRANSLATIONS } from '../constants';

interface Props {
  color: string;
  onChange: (newColor: string) => void;
  onClose: () => void;
  lang: 'en' | 'es';
}

const LED_COLORS: { id: string; hex: string; labelKey: keyof typeof TRANSLATIONS.en.colors }[] = [
    { id: 'red', hex: '#ff2222', labelKey: 'red' },
    { id: 'green', hex: '#22c55e', labelKey: 'green' },
    { id: 'blue', hex: '#3b82f6', labelKey: 'blue' },
    { id: 'yellow', hex: '#eab308', labelKey: 'yellow' },
    { id: 'orange', hex: '#f97316', labelKey: 'orange' },
    { id: 'white', hex: '#f8fafc', labelKey: 'white' }
];

export const LEDEditor: React.FC<Props> = ({ color, onChange, onClose, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="absolute top-20 right-4 bg-lab-panel border border-slate-600 p-4 rounded-lg shadow-xl z-50 w-64 flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">{t.ledColor}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
          {LED_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange(c.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded hover:bg-slate-700 transition-colors ${color === c.id ? 'bg-slate-700 ring-2 ring-lab-accent' : ''}`}
              >
                  <div className="w-8 h-8 rounded-full border border-slate-500 shadow-lg" style={{ backgroundColor: c.hex }}></div>
                  <span className="text-xs text-slate-300">{t.colors[c.labelKey]}</span>
              </button>
          ))}
      </div>
    </div>
  );
};
