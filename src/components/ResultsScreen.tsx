import React from 'react';

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  onNewFile: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, onRestart, onNewFile }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = '';

  if (percentage === 100) {
    message = '¡Perfecto! 🏆';
  } else if (percentage >= 80) {
    message = '¡Excelente trabajo! 🌟';
  } else if (percentage >= 50) {
    message = 'Bien hecho 👍';
  } else {
    message = 'Sigue practicando 💪';
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500 w-full max-w-2xl">
      <h2 className="text-4xl font-bold text-stone-900 mb-2 font-serif">Resultados</h2>
      <p className="text-xl font-medium mb-12 text-stone-600 italic font-serif">{message}</p>

      <div className="w-64 h-64 border-4 border-stone-900 flex flex-col items-center justify-center mb-12 bg-white shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
        <div className="text-7xl font-bold text-stone-900 tracking-tighter">
          {percentage}%
        </div>
        <div className="text-lg text-stone-500 mt-2 font-mono border-t-2 border-stone-200 pt-2 w-32">
          {score} / {total}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <button
          onClick={onRestart}
          className="flex-1 px-6 py-4 bg-stone-900 text-[#fcfbf9] font-bold tracking-wider uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          Repetir Examen
        </button>
        <button
          onClick={onNewFile}
          className="flex-1 px-6 py-4 bg-transparent border-2 border-stone-900 text-stone-900 font-bold tracking-wider uppercase hover:bg-stone-100 transition-colors"
        >
          Cargar Otro CSV
        </button>
      </div>
    </div>
  );
};