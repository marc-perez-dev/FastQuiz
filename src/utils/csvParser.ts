import Papa from 'papaparse';
import type { Question, Option } from '../types';

export type CSVFormat = 'standard' | 'legacy' | 'simple' | 'auto';

// 1. Centralización de "La Verdad" (Constantes)
const TRUTHY_VALUES = ['true', 'verdadero', 'yes', 'si', 'sí', 'v', 't', 's', '1'];
const FALSY_VALUES = ['false', 'falso', 'no', 'f', 'n', '0'];

// Helper para limpiar textos que el parser no pudo procesar correctamente (ej. espacios antes de comillas)
const cleanCSVText = (text: string | undefined): string => {
  if (!text) return '';
  let cleaned = text.trim();
  // Si el texto sigue entre comillas (artefacto del CSV), las quitamos y des-escapamos comillas dobles internas
  if (cleaned.length >= 2 && cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1).replace(/""/g, '"');
  }
  return cleaned;
};

export const parseCSV = (file: File | string, format: CSVFormat = 'standard'): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file as any, {
      beforeFirstChunk: (chunk) => {
        // Fix for CSVs with spaces after commas causing parsing issues with quoted fields containing commas
        // Transforms: ..., "Text, with comma", ... -> ...,"Text, with comma",...
        return chunk.replace(/,\s+"/g, ',"');
      },
      complete: (results) => {
        try {
          const questions: Question[] = [];
          const data = results.data as string[][];

          let usedFormat = format;

          // Auto-detection logic
          if (usedFormat === 'auto' && data.length > 0) {
            const header = data[0];
            const firstRow = data.length > 1 ? data[1] : null;

            // Check headers first
            const headerStr = header.join(' ').toLowerCase();
            
            // 2. Actualización de la Lógica de Detección (Headers)
            const legacyKeywords = [
              'correcta1', 'respuesta1', 'iscorrect1', 'answer1', 'correct1',
              'correcta 1', 'respuesta 1', 'is correct 1', 'answer 1', 'correct 1'
            ];

            const standardKeywords = [
              'correcta?', 'iscorrect', 'opción 1', 'correct?', 'option 1', 'option1',
              'is correct'
            ];

            // "correct" y "solución" son peligrosos, los dejamos al final
            const simpleKeywords = ['respuesta_correcta', 'correct_answer', 'respuesta correcta', 'correct answer', 'solution', 'solución', 'correct'];

            if (legacyKeywords.some(kw => headerStr.includes(kw))) {
              usedFormat = 'legacy';
            } else if (standardKeywords.some(kw => headerStr.includes(kw))) {
              usedFormat = 'standard';
            } else if (simpleKeywords.some(kw => headerStr.includes(kw))) {
              usedFormat = 'simple';
            } else if (firstRow) {
              // 3. Mejora de la Detección por Contenido (Fallback)
              const isBooleanString = (value: string | undefined): boolean => {
                if (typeof value !== 'string') return false;
                const normalized = value.trim().toLowerCase();
                return TRUTHY_VALUES.includes(normalized) || FALSY_VALUES.includes(normalized);
              };
              
              // Standard: Question, Option1, IsCorrect1 (index 2)
              // Legacy: Question, Opt1, Opt2, Opt3, Opt4, Bool1 (index 5)
              
              if (firstRow.length > 2 && isBooleanString(firstRow[2])) {
                usedFormat = 'standard';
              } else if (firstRow.length > 5 && isBooleanString(firstRow[5])) {
                usedFormat = 'legacy';
              } else {
                // If neither standard nor legacy boolean patterns match, assume simple format
                // (Question, Correct, Incorrect, Incorrect...)
                usedFormat = 'simple';
              }
            } else {
              usedFormat = 'standard'; // Default if empty or just header
            }
            console.log(`CSV Auto-detection: Detected ${usedFormat}`);
          }

          // Empezamos desde la fila 1 (índice 1) asumiendo que la fila 0 es cabecera.
          for (let i = 1; i < data.length; i++) {
            const row = data[i];
            
            // Ignorar filas vacías
            if (!row || row.length < 2 || !row[0]) continue;

            const statement = cleanCSVText(row[0]);
            if (!statement) continue;

            const options: Option[] = [];
            
            // 4. Actualización del Parser (Conversión de datos)
            const toBoolean = (value: string | undefined): boolean => {
              if (typeof value !== 'string') return false;
              const normalized = value.trim().toLowerCase();
              return TRUTHY_VALUES.includes(normalized);
            };

            if (usedFormat === 'standard') {
              // Standard Format (New): Question, Option1, IsCorrect1, Option2, IsCorrect2, ...
              // Iterate pairs from column 1
              for (let j = 1; j < row.length; j += 2) {
                const optionText = cleanCSVText(row[j]);
                
                // If no option text, skip
                if (!optionText) continue;

                const isCorrect = toBoolean(row[j + 1]);

                options.push({
                  id: crypto.randomUUID(),
                  text: optionText,
                  isCorrect
                });
              }
            } else if (usedFormat === 'legacy') {
              // Legacy Format: Question, Opt1, Opt2, Opt3, Opt4, Bool1, Bool2, Bool3, Bool4
              // We expect 4 options and 4 correctness indicators.
              for (let j = 0; j < 4; j++) { 
                const optionText = cleanCSVText(row[j + 1]); // Options are from column 1 to 4
                const isCorrect = toBoolean(row[j + 5]); // Correctness indicators are from column 5 to 8

                if (optionText) { 
                  options.push({
                    id: crypto.randomUUID(),
                    text: optionText,
                    isCorrect
                  });
                }
              }
            } else if (usedFormat === 'simple') {
               // Simple Format: Question, CorrectAnswer, Option2, Option3, Option4...
               // Column 1 is ALWAYS correct.
               // Columns 2+ are ALWAYS incorrect.
               
               // 1. Process Correct Answer (Column 1)
               const correctText = cleanCSVText(row[1]);
               if (correctText) {
                 options.push({
                   id: crypto.randomUUID(),
                   text: correctText,
                   isCorrect: true
                 });
               }

               // 2. Process Incorrect Answers (Columns 2+)
               for (let j = 2; j < row.length; j++) {
                 const optionText = cleanCSVText(row[j]);
                 if (optionText) {
                   options.push({
                     id: crypto.randomUUID(),
                     text: optionText,
                     isCorrect: false
                   });
                 }
               }
            }

            if (options.length > 0) {
              questions.push({
                id: crypto.randomUUID(),
                statement,
                options: shuffleArray(options)
              });
            }
          }

          resolve(shuffleArray(questions));
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(error);
      },
      skipEmptyLines: true,
      encoding: "UTF-8",
    });
  });
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
