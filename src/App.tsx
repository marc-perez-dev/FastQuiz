import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUpload } from './components/FileUpload';
import { QuizRunner } from './components/QuizRunner';
import { ResultsScreen } from './components/ResultsScreen';
import { LanguageSelector } from './components/LanguageSelector';
import type { Question } from './types';
import { shuffleArray } from './utils/csvParser';

type AppState = 'upload' | 'quiz' | 'results';

function App() {
  const { t } = useTranslation();
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
    <div className="layout-container">
      <header className="header-main">
        <div className="header-content">
          <h1 className="title-main">
            {t('app.title')}
          </h1>
          <div className="flex items-center gap-6">
            <LanguageSelector />
            {appState !== 'upload' && (
              <button 
                onClick={handleNewFile}
                className="btn-link"
              >
                {t('app.exit')}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {appState === 'upload' && (
          <div className="w-full mt-10 animate-appear">
            <div className="text-center mb-10">
              <h2 className="title-hero">{t('app.uploadTitle')}</h2>
              <p className="text-hero">
                {t('app.uploadDesc')}
              </p>
            </div>
            <FileUpload onLoad={handleLoad} />
            
            <div className="card-upload-example">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-2 inline-block">
                {t('app.csvExampleTitle')}
              </h3>
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
