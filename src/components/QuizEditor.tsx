import React, { useState } from 'react';
import type { Question, Option } from '../types';
import { generateCSV, downloadCSV } from '../utils/csvGenerator';
import { ConfirmationModal } from './ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface QuizEditorProps {
  initialQuestions: Question[];
  onCancel: () => void;
  onPlay: (questions: Question[]) => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ initialQuestions, onCancel, onPlay }) => {
  const { t } = useTranslation();
  // Si no hay preguntas iniciales (Crear nuevo), empezamos con una plantilla vacía
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions.length > 0 ? initialQuestions : [createEmptyQuestion()]
  );
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  function createEmptyQuestion(): Question {
    return {
      id: crypto.randomUUID(),
      statement: '',
      options: [
        { id: crypto.randomUUID(), text: '', isCorrect: true },
        { id: crypto.randomUUID(), text: '', isCorrect: false }
      ]
    };
  }

  // --- Helpers para actualizar el estado anidado ---
  const updateQuestion = (qIndex: number, field: string, value: string) => {
    const newQs = [...questions];
    newQs[qIndex] = { ...newQs[qIndex], [field]: value };
    setQuestions(newQs);
  };

  const updateOption = <K extends keyof Option>(qIndex: number, oIndex: number, field: K, value: Option[K]) => {
    const newQs = [...questions];
    const newOpts = [...newQs[qIndex].options];
    newOpts[oIndex] = { ...newOpts[oIndex], [field]: value };
    newQs[qIndex].options = newOpts;
    setQuestions(newQs);
  };

  const addOption = (qIndex: number) => {
    const newQs = [...questions];
    newQs[qIndex].options.push({ id: crypto.randomUUID(), text: '', isCorrect: false });
    setQuestions(newQs);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQs = [...questions];
    newQs[qIndex].options = newQs[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(newQs);
  };

  const removeQuestion = (qIndex: number) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const handleDownload = () => {
    const csv = generateCSV(questions);
    downloadCSV(csv);
  };

  const handleCancelClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsConfirmModalOpen(false);
    onCancel();
  };

  return (
    <div className="w-full max-w-3xl animate-appear pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Editor de Quiz</h2>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={handleCancelClick} className="py-2 px-4 text-xs">
             Cancelar
           </Button>
           <Button variant="primary" onClick={handleDownload} className="py-2 px-4 text-xs bg-stone-700 hover:bg-stone-600">
             💾 Descargar CSV
           </Button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <Card variant="question" key={q.id} className="relative group">
            {/* Botón borrar pregunta */}
            <button 
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-4 text-stone-400 hover:text-red-600 font-bold transition-colors"
              title="Borrar pregunta"
            >
              🗑
            </button>
            
            <label className="block font-bold mb-2 text-stone-700">Pregunta {qIndex + 1}</label>
            <input
              className="w-full p-3 border-2 border-stone-300 focus:border-stone-900 outline-none font-serif text-lg mb-6 transition-colors bg-stone-50"
              placeholder="Escribe aquí el enunciado..."
              value={q.statement}
              onChange={(e) => updateQuestion(qIndex, 'statement', e.target.value)}
            />

            <div className="space-y-3 pl-0 sm:pl-4 sm:border-l-4 border-stone-200">
              {q.options.map((opt, oIndex) => (
                <div key={opt.id} className="flex items-center gap-3">
                  {/* Checkbox esCorrecta */}
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) => updateOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                    className="w-5 h-5 accent-stone-900 cursor-pointer shrink-0"
                    title="Marcar como respuesta correcta"
                  />
                  
                  {/* Input Texto Opción */}
                  <input
                    className={`flex-1 p-2 border outline-none transition-colors ${
                      opt.isCorrect 
                        ? 'bg-green-50 border-green-300 focus:border-green-600 text-green-900 font-medium' 
                        : 'bg-stone-50 border-stone-300 focus:border-stone-900'
                    }`}
                    placeholder={`Opción ${oIndex + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                  />
                  
                  {/* Borrar opción */}
                  <button 
                    onClick={() => removeOption(qIndex, oIndex)}
                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => addOption(qIndex)} 
                className="text-sm font-bold text-stone-500 hover:text-stone-900 mt-2 px-2 py-1 hover:bg-stone-100 rounded inline-block transition-colors"
              >
                + Añadir Opción
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Barra de acción flotante o fija al final */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 z-50 pointer-events-none">
        <div className="bg-stone-50 p-2 border-2 border-stone-900 shadow-lg pointer-events-auto flex gap-3">
            <Button 
              variant="secondary"
              onClick={() => setQuestions([...questions, createEmptyQuestion()])}
              className="py-2 px-6 bg-stone-50"
            >
            + Nueva Pregunta
            </Button>
            <Button 
              variant="primary"
              onClick={() => onPlay(questions)}
              className="py-2 px-6"
            >
            ▶ Jugar Ahora
            </Button>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        title={t('editor.cancelTitle') || "¿Estás seguro?"}
        message={t('editor.cancelMessage') || "Si sales ahora, perderás todos los cambios no guardados."}
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsConfirmModalOpen(false)}
        confirmText={t('editor.confirmExit') || "Salir sin guardar"}
        cancelText={t('editor.cancelExit') || "Continuar editando"}
      />
    </div>
  );
};