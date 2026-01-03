import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Question, Option } from '../types';
import { twMerge } from 'tailwind-merge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

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
  const { t } = useTranslation();
  
  // Helper para determinar estilos
  const getOptionStyles = (option: Option) => {
    const isSelected = selectedOptionIds.includes(option.id);

    if (!isValidated) {
      // Estado de Selección (Pre-validación)
      if (isSelected) {
        return "border-stone-900 bg-stone-900 text-stone-50 ring-0";
      }
      return "border-stone-300 hover:border-stone-900 bg-stone-50 text-stone-800 hover:bg-stone-100";
    }

    // Estado Validado
    if (option.isCorrect) {
      // Era correcta
      if (isSelected) {
        return "border-green-800 bg-green-100 text-green-900 font-medium"; // Acierto
      } else {
        return "border-green-700 border-dashed bg-transparent text-green-800 opacity-75"; // Correcta no marcada
      }
    }
    else {
      // No era correcta
      if (isSelected) {
        return "border-red-800 bg-red-100 text-red-900 font-medium"; // Fallo
      }
      return "border-stone-200 text-stone-400 opacity-50"; // Irrelevante
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 md:p-4">
      <Card variant="question">
        <h2 className="text-xl font-bold text-stone-900 mb-4 leading-snug font-serif">
          {question.statement}
        </h2>

        {question.options.filter(o => o.isCorrect).length > 1 && (
          <div className="mb-4 inline-block px-3 py-1 border-2 border-stone-900 bg-yellow-100 text-stone-900 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
             {t('questionCard.multipleChoice')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => !isValidated && onToggleOption(option.id)}
              disabled={isValidated}
              className={twMerge(
                "w-full text-left p-3 border-2 transition-all duration-200 flex items-start group h-full",
                getOptionStyles(option),
                isValidated ? "cursor-default" : "cursor-pointer active:translate-y-1"
              )}
            >
              {/* Indicador de tecla (Badge) */}
              <div className={twMerge(
                "flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold border-2 shrink-0 transition-colors mt-0.5",
                selectedOptionIds.includes(option.id) && !isValidated
                  ? "border-stone-50 text-stone-50" 
                  : "border-stone-400 text-stone-500 group-hover:border-stone-900 group-hover:text-stone-900",
                isValidated && "border-transparent opacity-50"
              )}>
                {index + 1}
              </div>

              <div className="flex-1 text-base leading-tight">
                {option.text}
              </div>
              
              {/* Iconos de feedback */}
              {isValidated && option.isCorrect && (
                <span className="text-green-700 font-bold ml-2 text-lg">✓</span>
              )}
              {isValidated && !option.isCorrect && selectedOptionIds.includes(option.id) && (
                <span className="text-red-700 font-bold ml-2 text-lg">✗</span>
              )}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        {!isValidated && (
          <Button
            onClick={onConfirm}
            disabled={selectedOptionIds.length === 0}
            variant="primary"
            className="py-2 px-6"
          >
            {t('questionCard.confirm')}
          </Button>
        )}
      </div>
    </div>
  );
};