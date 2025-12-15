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
        return "option-selected";
      }
      return "option-default";
    }

    // Estado Validado
    if (option.isCorrect) {
      // Era correcta
      if (isSelected) {
        return "option-correct-selected"; // Acierto
      } else {
        return "option-correct-unselected"; // Correcta no marcada
      }
    } else {
      // No era correcta
      if (isSelected) {
        return "option-wrong-selected"; // Fallo
      }
      return "option-disabled"; // Irrelevante
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="card-question">
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
                "option-btn-base group",
                getOptionStyles(option),
                isValidated ? "cursor-default" : "cursor-pointer active:translate-y-1"
              )}
            >
              {/* Indicador de tecla (Badge) */}
              <div className={twMerge(
                "option-badge",
                selectedOptionIds.includes(option.id) && !isValidated
                  ? "option-badge-selected" 
                  : "option-badge-default",
                isValidated && "option-badge-faded"
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
            className="btn-primary"
          >
            Confirmar Respuesta
          </button>
        )}
      </div>
    </div>
  );
};