import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUpload } from './components/FileUpload';
import { QuizRunner } from './components/QuizRunner';
import { ResultsScreen } from './components/ResultsScreen';
import { QuizEditor } from './components/QuizEditor';
import { LanguageSelector } from './components/LanguageSelector';
import type { Question } from './types';
import { shuffleArray, parseCSV } from './utils/csvParser';

type AppState = 'upload' | 'quiz' | 'results' | 'editor';

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

  const handleOpenEditor = (initialData: Question[] = []) => {
    setQuestions(initialData); // Si pasamos [], es nuevo. Si pasamos questions, es editar.
    setAppState('editor');
  };

  const handleUploadToEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const parsed = await parseCSV(file, 'auto');
      if (parsed.length > 0) {
        handleOpenEditor(parsed);
      } else {
        alert(t('upload.errorEmpty'));
      }
    } catch (err) {
      console.error(err);
      alert(t('upload.errorProcessing'));
    }
    // Clear input
    e.target.value = '';
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
            
            <div className="flex flex-col items-center mt-8 mb-8 w-full max-w-md mx-auto space-y-3">
              <div className="relative w-full text-center mb-1">
                <span className="bg-[#fcfbf9] px-2 text-sm text-stone-400 font-medium">{t('app.orPreference')}</span>
              </div>
              
              <button 
                onClick={() => handleOpenEditor([])}
                className="btn-secondary w-full py-3 flex items-center justify-center gap-2 group"
              >
                <span>✏️</span> {t('app.manualCreate')}
              </button>

              <div className="w-full relative">
                 <input 
                   type="file" 
                   accept=".csv"
                   onChange={handleUploadToEdit}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   title={t('app.uploadToEdit')}
                 />
                 <button className="btn-secondary w-full py-3 flex items-center justify-center gap-2 group text-stone-500 hover:text-stone-800 border-stone-300 hover:border-stone-500">
                    <span>📂</span> {t('app.uploadToEdit')}
                 </button>
              </div>
            </div>

            <div className="card-upload-example">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-2 inline-block">
                {t('app.csvExampleTitle')}
              </h3>
              <div className="overflow-x-auto">
                <code className="text-sm text-stone-800 font-mono whitespace-pre block">
                  {t('app.csvExampleHeader')}<br/>
                  {t('app.csvExampleRow1')}<br/>
                  {t('app.csvExampleRow2')}
                </code>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  {t('app.otherFormats')}
                </p>
                <div className="space-y-1 text-xs text-stone-600 font-mono">
                  <p>{t('app.formatSimple')}</p>
                  <p>{t('app.formatLegacy')}</p>
                </div>
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
          <div className="flex flex-col w-full items-center">
            <ResultsScreen 
              score={finalResult.score} 
              total={finalResult.total}
              onRestart={handleRestart}
              onNewFile={handleNewFile}
            />
            <button 
              onClick={() => handleOpenEditor(questions)}
              className="mt-6 text-stone-500 hover:text-stone-900 underline text-sm"
            >
              {t('results.editQuestions')}
            </button>
          </div>
        )}

        {appState === 'editor' && (
          <QuizEditor 
            initialQuestions={questions}
            onCancel={() => setAppState('upload')}
            onPlay={(qs) => {
              setQuestions(qs);
              setAppState('quiz');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
