import React from 'react';
import type { Question, Option } from '../types';
import { twMerge } from 'tailwind-merge';

interface QuestionCardProps {
  question: Question;
  selectedOptionIds: string[];
  isValidated: boolean;
  onToggleOption: (optionId: string) => void;
  onConfirm: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionIds,
  isValidated,
  onToggleOption,
  onConfirm,
}) => {
  
  // Helper para determinar estilos
  const getOptionStyles = (option: Option) => {
    const isSelected = selectedOptionIds.includes(option.id);

    if (!isValidated) {
      // Estado de Selección (Pre-validación)
      if (isSelected) {
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500";
      }
      return "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300";
    }

    // Estado Validado
    if (option.isCorrect) {
      // Era correcta
      if (isSelected) {
        return "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 ring-1 ring-green-500"; // Acierto
      } else {
        return "border-green-500 border-dashed bg-green-50/50 dark:bg-green-900/10 text-green-700 dark:text-green-300 opacity-75"; // Correcta no marcada
      }
    } else {
      // No era correcta
      if (isSelected) {
        return "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 ring-1 ring-red-500"; // Fallo
      }
      return "border-gray-200 dark:border-gray-700 opacity-50"; // Irrelevante
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 leading-relaxed">
          {question.statement}
        </h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => !isValidated && onToggleOption(option.id)}
              disabled={isValidated}
              className={twMerge(
                "w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-start",
                getOptionStyles(option),
                isValidated ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
              )}
            >
              <div className="flex-1">
                {option.text}
              </div>
              
              {/* Iconos de feedback */}
              {isValidated && option.isCorrect && (
                <span className="text-green-600 dark:text-green-400 ml-2">✓</span>
              )}
              {isValidated && !option.isCorrect && selectedOptionIds.includes(option.id) && (
                <span className="text-red-600 dark:text-red-400 ml-2">✗</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        {!isValidated && (
          <button
            onClick={onConfirm}
            disabled={selectedOptionIds.length === 0}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar Respuesta
          </button>
        )}
      </div>
    </div>
  );
};
