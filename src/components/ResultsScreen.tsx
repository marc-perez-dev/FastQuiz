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
  let colorClass = '';

  if (percentage === 100) {
    message = '¡Perfecto! 🏆';
    colorClass = 'text-green-500';
  } else if (percentage >= 80) {
    message = '¡Excelente trabajo! 🌟';
    colorClass = 'text-blue-500';
  } else if (percentage >= 50) {
    message = 'Bien hecho 👍';
    colorClass = 'text-yellow-500';
  } else {
    message = 'Sigue practicando 💪';
    colorClass = 'text-gray-500';
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Resultados</h2>
      <p className={`text-xl font-medium mb-8 ${colorClass}`}>{message}</p>

      <div className="w-48 h-48 rounded-full border-8 border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center mb-10 shadow-inner bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="text-5xl font-bold text-gray-900 dark:text-white z-10">
          {percentage}%
        </div>
        <div className="text-sm text-gray-400 z-10 mt-1">
          {score} / {total}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={onRestart}
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Repetir Examen
        </button>
        <button
          onClick={onNewFile}
          className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cargar Otro CSV
        </button>
      </div>
    </div>
  );
};
