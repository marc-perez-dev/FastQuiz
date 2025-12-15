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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <header className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FastQuiz
          </h1>
          {appState !== 'upload' && (
            <button 
              onClick={handleNewFile}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
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
              <h2 className="text-3xl font-bold mb-4">Sube tus preguntas</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Carga un archivo CSV para generar automáticamente un examen interactivo.
                El formato es flexible y soporta múltiples respuestas correctas.
              </p>
            </div>
            <FileUpload onLoad={handleLoad} />
            
            <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">Ejemplo de formato CSV</h3>
              <div className="overflow-x-auto">
                <code className="text-xs bg-gray-100 dark:bg-gray-950 p-4 block rounded text-gray-600 dark:text-gray-300 font-mono whitespace-pre">
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