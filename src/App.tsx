import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { QuizRunner } from './components/QuizRunner';
import { ResultsScreen } from './components/ResultsScreen';
import type { Question } from './types';
import { shuffleArray } from './utils/csvParser';

type AppState = 'upload' | 'quiz' | 'results';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [appState, setAppState] = useState<AppState>('upload');
  const [finalResult, setFinalResult] = useState({ score: 0, total: 0 });

  const handleLoad = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setAppState('quiz');
  };

  const handleFinish = (score: number, total: number) => {
    setFinalResult({ score, total });
    setAppState('results');
  };

  const handleRestart = () => {
    // Re-barajar las preguntas para que el orden sea distinto
    setQuestions(prev => shuffleArray([...prev]));
    setAppState('quiz');
  };

  const handleNewFile = () => {
    setQuestions([]);
    setAppState('upload');
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 font-sans selection:bg-stone-200">
      <header className="p-6 border-b-2 border-stone-900 bg-[#fcfbf9] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            FastQuiz
          </h1>
          {appState !== 'upload' && (
            <button 
              onClick={handleNewFile}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 underline decoration-2 underline-offset-4"
            >
              Salir
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 flex flex-col items-center">
        {appState === 'upload' && (
          <div className="w-full mt-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4 text-stone-900">Sube tus preguntas</h2>
              <p className="text-stone-600 max-w-lg mx-auto text-lg">
                Carga un archivo CSV para generar automáticamente un examen interactivo.
                El formato es flexible y soporta múltiples respuestas correctas.
              </p>
            </div>
            <FileUpload onLoad={handleLoad} />
            
            <div className="mt-16 p-8 bg-[#f5f5dc] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] max-w-2xl mx-auto">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-2 inline-block">Ejemplo de formato CSV</h3>
              <div className="overflow-x-auto">
                <code className="text-sm text-stone-800 font-mono whitespace-pre block">
                  Pregunta,Opción 1,Correcta?,Opción 2,Correcta?,...<br/>
                  "¿Capital de Francia?","París",TRUE,"Londres",FALSE<br/>
                  "¿Colores primarios luz?","Rojo",TRUE,"Verde",TRUE,"Amarillo",FALSE
                </code>
              </div>
            </div>
          </div>
        )}

        {appState === 'quiz' && (
          <QuizRunner 
            questions={questions} 
            onFinish={handleFinish} 
          />
        )}

        {appState === 'results' && (
          <ResultsScreen 
            score={finalResult.score} 
            total={finalResult.total}
            onRestart={handleRestart}
            onNewFile={handleNewFile}
          />
        )}
      </main>
    </div>
  );
}

export default App;
