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
        return "border-stone-900 bg-stone-900 text-white ring-0";
      }
      return "border-stone-300 hover:border-stone-900 bg-white text-stone-800 hover:bg-stone-50";
    }

    // Estado Validado
    if (option.isCorrect) {
      // Era correcta
      if (isSelected) {
        return "border-green-700 bg-green-100 text-green-900 font-medium"; // Acierto
      } else {
        return "border-green-600 border-dashed bg-transparent text-green-800 opacity-75"; // Correcta no marcada
      }
    } else {
      // No era correcta
      if (isSelected) {
        return "border-red-700 bg-red-100 text-red-900 font-medium"; // Fallo
      }
      return "border-stone-200 text-stone-400 opacity-50"; // Irrelevante
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-[#fcfbf9] border-2 border-stone-900 p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
        <h2 className="text-2xl font-bold text-stone-900 mb-8 leading-snug font-serif">
          {question.statement}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => !isValidated && onToggleOption(option.id)}
              disabled={isValidated}
              className={twMerge(
                "w-full text-left p-5 border-2 transition-all duration-200 flex items-start group",
                getOptionStyles(option),
                isValidated ? "cursor-default" : "cursor-pointer active:translate-y-1"
              )}
            >
              {/* Indicador de tecla (Badge) */}
              <div className={twMerge(
                "flex items-center justify-center w-8 h-8 mr-4 text-sm font-bold border-2 shrink-0 transition-colors",
                selectedOptionIds.includes(option.id) && !isValidated
                  ? "border-white text-white" 
                  : "border-stone-400 text-stone-500 group-hover:border-stone-900 group-hover:text-stone-900",
                isValidated && "border-transparent opacity-50"
              )}>
                {index + 1}
              </div>

              <div className="flex-1 text-lg">
                {option.text}
              </div>
              
              {/* Iconos de feedback */}
              {isValidated && option.isCorrect && (
                <span className="text-green-700 font-bold ml-3 text-xl">✓</span>
              )}
              {isValidated && !option.isCorrect && selectedOptionIds.includes(option.id) && (
                <span className="text-red-700 font-bold ml-3 text-xl">✗</span>
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
            className="px-8 py-4 bg-stone-900 text-[#fcfbf9] font-bold text-sm tracking-wider uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Confirmar Respuesta
          </button>
        )}
      </div>
    </div>
  );
};