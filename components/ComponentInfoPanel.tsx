import React from 'react';
import { ComponentType } from '../types';
import { COMPONENT_INFO } from '../constants';
import { Info, X, Lightbulb } from 'lucide-react';

interface Props {
  type: ComponentType;
  onClose: () => void;
}

export const ComponentInfoPanel: React.FC<Props> = ({ type, onClose }) => {
  const info = COMPONENT_INFO[type];

  if (!info) return null;

  return (
    <div className="w-full bg-slate-800 border-b border-slate-600 px-6 py-2 flex items-center justify-between animate-fade-in z-30 shrink-0 shadow-md">
      
      {/* Left Section: Title & Description */}
      <div className="flex items-center gap-4 flex-1 overflow-hidden mr-4">
        <div className="flex items-center gap-2 text-lab-accent font-bold whitespace-nowrap">
            <Info size={18}/>
            <span className="text-sm uppercase tracking-wider">{info.title}</span>
        </div>
        <div className="h-4 w-px bg-slate-600 shrink-0"></div>
        <p className="text-sm text-slate-300 truncate">
          {info.description}
        </p>
      </div>

      {/* Right Section: Tips & Close */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
            <Lightbulb size={14} />
            <span className="font-medium">{info.tips}</span>
        </div>
        
        <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white transition-colors hover:bg-slate-700 p-1 rounded-md"
        >
            <X size={16}/>
        </button>
      </div>

    </div>
  );
};