
import React from 'react';
import { ResistorBandColor } from '../types';
import { BAND_COLORS, TRANSLATIONS } from '../constants';

interface Props {
  bands: ResistorBandColor[];
  onChange: (newBands: ResistorBandColor[]) => void;
  onClose: () => void;
  value: string;
  lang: 'en' | 'es';
}

const colors: ResistorBandColor[] = [
  'black', 'brown', 'red', 'orange', 'yellow', 
  'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver'
];

export const ResistorEditor: React.FC<Props> = ({ bands, onChange, onClose, value, lang }) => {
  const isFiveBand = bands.length === 5;
  const t = TRANSLATIONS[lang];

  const handleModeChange = (fiveBand: boolean) => {
    if (fiveBand && !isFiveBand) {
        const newBands = [...bands];
        newBands.splice(2, 0, 'black');
        onChange(newBands);
    } else if (!fiveBand && isFiveBand) {
        const newBands = [...bands];
        newBands.splice(2, 1);
        onChange(newBands);
    }
  };

  const updateBand = (index: number, color: ResistorBandColor) => {
    const newBands = [...bands];
    newBands[index] = color;
    onChange(newBands);
  };

  const getBandLabel = (index: number) => {
      if (!isFiveBand) {
          if (index === 0) return t.band1;
          if (index === 1) return t.band2;
          if (index === 2) return t.multiplier;
          if (index === 3) return t.tolerance;
      } else {
          if (index === 0) return t.band1;
          if (index === 1) return t.band2;
          if (index === 2) return t.band3;
          if (index === 3) return t.multiplier;
          if (index === 4) return t.tolerance;
      }
      return `${t.bandGeneric} ${index + 1}`;
  };

  return (
    <div className="absolute top-20 right-4 bg-lab-panel border border-slate-600 p-4 rounded-lg shadow-xl z-50 w-72 flex flex-col max-h-[85vh]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">{t.resistorBuilder}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-slate-900 rounded p-1 mb-4">
          <button 
            onClick={() => handleModeChange(false)}
            className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${!isFiveBand ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
          >
              {t.bands4}
          </button>
          <button 
            onClick={() => handleModeChange(true)}
            className={`flex-1 text-xs font-bold py-1.5 rounded transition-colors ${isFiveBand ? 'bg-lab-accent text-black' : 'text-slate-400 hover:text-white'}`}
          >
              {t.bands5}
          </button>
      </div>
      
      <div className="mb-4 text-center bg-slate-800 rounded p-2 border border-slate-700">
        <div className="text-2xl font-mono text-lab-accent font-bold">{value}</div>
        <div className="flex justify-center mt-3 space-x-1">
            {/* Visual Preview */}
            <div className="relative h-10 w-48 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-500">
                <div className="absolute inset-0 bg-neutral-200"></div>
                <div className="flex space-x-2 relative z-10 w-full justify-center">
                    {bands.map((band, i) => (
                        <div 
                            key={i} 
                            className="w-4 h-10 shadow-sm" 
                            style={{ backgroundColor: BAND_COLORS[band] }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
        {bands.map((currentBandColor, bandIdx) => (
          <div key={bandIdx} className="space-y-1">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">{getBandLabel(bandIdx)}</div>
            <div className="flex flex-wrap gap-1.5">
                {colors.map(color => (
                <button
                    key={color}
                    onClick={() => updateBand(bandIdx, color)}
                    className={`w-5 h-5 rounded-full border border-white/10 hover:scale-110 transition-transform ${currentBandColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: BAND_COLORS[color] }}
                    title={color}
                />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
