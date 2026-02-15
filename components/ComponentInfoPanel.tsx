
import React, { useEffect, useState } from 'react';
import { Info, X, Lightbulb, BookOpen } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  tips?: string;
  type?: 'component' | 'preset';
  onClose: () => void;
  isSticky?: boolean; // Kept for compatibility but not used
}

export const ComponentInfoPanel: React.FC<Props> = ({ title, description, tips, type = 'component', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div 
        className={`absolute top-20 right-4 w-80 z-40 transition-all duration-300 transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
    >
        <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b border-slate-700 ${type === 'preset' ? 'bg-indigo-900/30' : 'bg-slate-700/30'}`}>
                <div className="flex items-center gap-2">
                    {type === 'preset' ? <BookOpen size={18} className="text-indigo-400"/> : <Info size={18} className="text-lab-accent"/>}
                    <span className="font-bold text-white text-sm uppercase tracking-wider truncate">{title}</span>
                </div>
                <button 
                    onClick={handleClose}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <X size={16}/>
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <p className="text-sm text-slate-300 leading-relaxed">
                    {description}
                </p>

                {tips && (
                    <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 p-2 rounded text-xs text-yellow-200 mt-2">
                        <Lightbulb size={14} className="shrink-0 mt-0.5 text-yellow-400" />
                        <span>{tips}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
