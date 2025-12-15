import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseCSV } from '../utils/csvParser';
import type { Question } from '../types';

interface FileUploadProps {
  onLoad: (questions: Question[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onLoad }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError(t('upload.errorExtension'));
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const questions = await parseCSV(file);
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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          dropzone-container
          ${isDragging 
            ? 'dropzone-active' 
            : 'dropzone-inactive'}
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
        <label
          htmlFor="file-upload"
          className="btn-upload"
        >
          {t('upload.selectFile')}
        </label>
      </div>

      {isLoading && <p className="mt-6 text-stone-900 font-medium animate-pulse">{t('upload.processing')}</p>}
      
      {error && (
        <div className="error-box">
          {error}
        </div>
      )}
    </div>
  );
};