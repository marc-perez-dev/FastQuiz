import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import { QuestionCard } from './QuestionCard';

interface QuizRunnerProps {
  questions: Question[];
  onFinish: (score: number, total: number) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);

  // Reiniciar estado interno al cambiar de pregunta
  useEffect(() => {
    setSelectedOptionIds([]);
    setIsValidated(false);
  }, [currentIndex]);

  const currentQuestion = questions[currentIndex];

  const handleToggleOption = (optionId: string) => {
    setSelectedOptionIds(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
  };

  const handleConfirm = () => {
    setIsValidated(true);

    // Lógica estricta: Deben coincidir exactamente los conjuntos
    const correctOptionIds = currentQuestion.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id);

    const isCorrect = 
      selectedOptionIds.length === correctOptionIds.length &&
      selectedOptionIds.every(id => correctOptionIds.includes(id));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish(score, questions.length); // Nota: score ya se actualizó en handleConfirm
    }
  };

  // Manejador de teclado global
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input (aunque no hay inputs aquí, es buena práctica)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key;

      // Selección numérica (1-9)
      if (!isValidated && /^[1-9]$/.test(key)) {
        const index = parseInt(key) - 1;
        if (index < currentQuestion.options.length) {
          handleToggleOption(currentQuestion.options[index].id);
        }
      }

      // Enter o Space: Confirmar o Siguiente
      if (key === 'Enter' || key === ' ') {
        e.preventDefault(); // Prevenir scroll al usar la barra espaciadora
        if (!isValidated) {
          if (selectedOptionIds.length > 0) {
            handleConfirm();
          }
        } else {
          handleNext();
        }
      }

      // Flecha derecha: Siguiente (solo si ya está validado)
      if (key === 'ArrowRight' && isValidated) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isValidated, selectedOptionIds, currentQuestion, currentIndex, questions.length]); // Dependencias importantes para closure actualizado

  return (
    <div className="w-full flex flex-col items-center">
      {/* Barra de progreso */}
      <div className="w-full max-w-2xl px-4 mb-4 flex justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
        <span>Pregunta {currentIndex + 1} de {questions.length}</span>
        <span>Aciertos: {score}</span>
      </div>
      
      <div className="w-full max-w-2xl px-4 mb-6">
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedOptionIds={selectedOptionIds}
        isValidated={isValidated}
        onToggleOption={handleToggleOption}
        onConfirm={handleConfirm}
      />

      {/* Botón Siguiente (separado de QuestionCard para control de flujo) */}
      {isValidated && (
        <div className="w-full max-w-2xl px-4 flex justify-end mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg shadow-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            {currentIndex === questions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};
