import React, { useCallback, useState } from 'react';
import { parseCSV } from '../utils/csvParser';
import type { Question } from '../types';

interface FileUploadProps {
  onLoad: (questions: Question[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Por favor, sube un archivo con extensión .csv');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const questions = await parseCSV(file);
      if (questions.length === 0) {
        setError('El archivo CSV no contiene preguntas válidas o tiene un formato incorrecto.');
      } else {
        onLoad(questions);
      }
    } catch (e) {
      console.error(e);
      setError('Ocurrió un error al procesar el archivo.');
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
          w-full p-12 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center
          ${isDragging 
            ? 'border-stone-900 bg-[#e8e6df]' 
            : 'border-stone-400 hover:border-stone-900 bg-transparent'}
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-stone-800 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>

        <p className="mb-2 text-xl font-bold text-stone-900">
          Arrastra tu CSV aquí
        </p>
        <p className="text-sm text-stone-500 mb-8 font-medium">
          o haz clic para seleccionar
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
          className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-[#fcfbf9] font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer uppercase tracking-wider"
        >
          Seleccionar Archivo
        </label>
      </div>

      {isLoading && <p className="mt-6 text-stone-900 font-medium animate-pulse">Procesando archivo...</p>}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-900 text-red-900 font-medium text-sm w-full shadow-[4px_4px_0px_0px_rgba(127,29,29,0.2)]">
          {error}
        </div>
      )}
    </div>
  );
};