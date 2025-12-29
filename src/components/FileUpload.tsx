import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { parseCSV } from '../utils/csvParser';
import type { Question } from '../types';

interface FileUploadProps {
  onLoad: (questions: Question[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onLoad }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'file' | 'text'>('file');
  const [csvText, setCsvText] = useState('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError(t('upload.errorExtension'));
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const questions = await parseCSV(file, 'auto');
      if (questions.length === 0) {
        setError(t('upload.errorEmpty'));
      } else {
        onLoad(questions);
      }
    } catch (e) {
      console.error(e);
      setError(t('upload.errorProcessing'));
    } finally {
      setIsLoading(false);
    }
  }, [t, setError, setIsLoading, onLoad]);

  const handleTextSubmit = async () => {
    if (!csvText.trim()) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
        const questions = await parseCSV(csvText, 'auto');
         if (questions.length === 0) {
          setError(t('upload.errorEmpty'));
        } else {
          onLoad(questions);
        }
    } catch (e) {
        console.error(e);
        setError(t('upload.errorProcessing'));
    } finally {
        setIsLoading(false);
    }
  };

  const handleDownload = () => {
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'quiz.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => { setMode('file'); setError(null); }}
            className={`pb-2 px-4 font-bold border-b-2 transition-colors ${mode === 'file' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            {t('upload.tabFile')}
          </button>
          <button 
            onClick={() => { setMode('text'); setError(null); }}
            className={`pb-2 px-4 font-bold border-b-2 transition-colors ${mode === 'text' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            {t('upload.tabText')}
          </button>
      </div>

      {mode === 'file' ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            w-full p-12 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center
            ${isDragging 
              ? 'border-stone-900 bg-stone-200' 
              : 'border-stone-400 hover:border-stone-900 bg-transparent'}
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-stone-800 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>

          <p className="mb-2 text-xl font-bold text-stone-900">
            {t('upload.dragDrop')}
          </p>
          <p className="text-sm text-stone-500 mb-8 font-medium">
            {t('upload.orClick')}
          </p>

          <input
            type="file"
            accept=".csv"
            className="hidden"
            id="file-upload"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            variant="upload"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {t('upload.selectFile')}
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
            <p className="text-sm text-stone-600 mb-2 font-medium">{t('upload.textModeDesc')}</p>
            <textarea
                className="w-full h-64 p-4 border-2 border-stone-400 focus:border-stone-900 outline-none bg-stone-50 resize-none font-mono text-sm transition-colors"
                placeholder={t('upload.pastePlaceholder')}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="flex gap-4">
                <Button 
                    variant="upload"
                    onClick={handleTextSubmit} 
                    disabled={!csvText.trim() || isLoading} 
                    className="flex-1"
                >
                    {t('upload.generate')}
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={handleDownload} 
                    disabled={!csvText.trim()} 
                    className="flex-1"
                >
                    {t('upload.downloadCsv')}
                </Button>
            </div>
        </div>
      )}

      {isLoading && <p className="mt-6 text-stone-900 font-medium animate-pulse">{t('upload.processing')}</p>}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-900 text-red-900 font-medium text-sm w-full shadow-[4px_4px_0px_0px_rgba(127,29,29,0.2)]">
          {error}
        </div>
      )}
    </div>
  );
};