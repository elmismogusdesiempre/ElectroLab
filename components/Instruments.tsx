
import React from 'react';
import { Gauge, Sliders } from 'lucide-react';
import { ComponentType } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  voltage: number;
  setVoltage: (v: number) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  onAddMultimeter?: () => void;
  theme: 'dark' | 'light';
  lang: 'en' | 'es';
}

export const Instruments: React.FC<Props> = ({ voltage, setVoltage, isSimulating, toggleSimulation, onAddMultimeter, theme, lang }) => {
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  return (
    <div className={`h-24 border-t flex items-center px-6 space-x-8 z-10 shadow-lg transition-colors ${isDark ? 'bg-lab-panel border-slate-700' : 'bg-white border-slate-200'}`}>
      
      {/* Variable Power Supply */}
      <div className={`flex items-center space-x-4 p-3 rounded-lg border ${isDark ? 'bg-black/30 border-slate-600' : 'bg-slate-100 border-slate-300'}`}>
        <div className={isDark ? 'text-lab-accent' : 'text-blue-600'}>
          <Sliders size={24} />
        </div>
        <div>
          <label className={`text-xs block uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.voltageSource}</label>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0" 
              max="24" 
              step="0.5" 
              value={voltage} 
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className={`w-32 ${isDark ? 'accent-lab-accent' : 'accent-blue-600'}`}
            />
            <span className="font-mono text-xl text-green-500 w-16 text-right">{voltage.toFixed(1)}V</span>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex justify-center">
         <button 
           onClick={toggleSimulation}
           className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transform transition-transform active:scale-95 flex items-center space-x-2 ${isSimulating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
         >
           {isSimulating ? (
             <><span>{t.stopSim}</span></>
           ) : (
             <><span>{t.startSim}</span></>
           )}
         </button>
      </div>

      {/* Multimeter Button */}
      <button 
        onClick={onAddMultimeter}
        className={`flex items-center space-x-4 p-3 rounded-lg border transition-colors group ${isDark ? 'bg-black/30 border-slate-600 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'}`}
      >
        <div className="text-yellow-500 group-hover:text-yellow-400">
          <Gauge size={24} />
        </div>
        <div className="text-left">
          <label className={`text-xs block uppercase tracking-wider cursor-pointer ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-700'}`}>{t.addMultimeter}</label>
          <div className={`font-mono text-xl ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-black'}`}>
             Select
          </div>
        </div>
      </button>

    </div>
  );
};
