import Papa from 'papaparse';
import type { Question, Option } from '../types';

export type CSVFormat = 'standard' | 'legacy' | 'simple' | 'auto';

export const parseCSV = (file: File, format: CSVFormat = 'standard'): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
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
            if (headerStr.includes('correcta1') || headerStr.includes('respuesta1')) {
              usedFormat = 'legacy';
            } else if (headerStr.includes('correcta?') || headerStr.includes('iscorrect') || headerStr.includes('opción 1')) {
              usedFormat = 'standard';
            } else if (headerStr.includes('respuesta_correcta') || headerStr.includes('correct_answer') || headerStr.includes('respuesta correcta')) {
              usedFormat = 'simple';
            } else if (firstRow) {
                          // Check data structure
                          const isBooleanString = (value: string | undefined): boolean => {
                            if (typeof value !== 'string') return false;
                            const normalized = value.trim().toLowerCase();
                            return ['true', 'verdadero', '1', 'si', 'yes', 'v', 'false', 'falso', '0', 'no', 'f'].includes(normalized);
                          };
              
                          // Standard: Question, Option1, IsCorrect1 (index 2)
                          // Legacy: Question, Opt1, Opt2, Opt3, Opt4, Bool1 (index 5)
                          
                          if (firstRow.length > 2 && isBooleanString(firstRow[2])) {
                            usedFormat = 'standard';
                          } else if (firstRow.length > 5 && isBooleanString(firstRow[5])) {
                            usedFormat = 'legacy';
                          } else {                // If neither standard nor legacy boolean patterns match, assume simple format
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

            const statement = row[0].trim();
            if (!statement) continue;

            const options: Option[] = [];
            
            // Helper function to convert various string representations to boolean
            const toBoolean = (value: string | undefined): boolean => {
              if (typeof value !== 'string') return false;
              const normalized = value.trim().toLowerCase();
              return ['true', 'verdadero', '1', 'si', 'yes', 'v'].includes(normalized);
            };

            if (usedFormat === 'standard') {
              // Standard Format (New): Question, Option1, IsCorrect1, Option2, IsCorrect2, ...
              // Iterate pairs from column 1
              for (let j = 1; j < row.length; j += 2) {
                const optionText = row[j]?.trim();
                
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
                const optionText = row[j + 1]?.trim(); // Options are from column 1 to 4
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
               if (row[1] && row[1].trim()) {
                 options.push({
                   id: crypto.randomUUID(),
                   text: row[1].trim(),
                   isCorrect: true
                 });
               }

               // 2. Process Incorrect Answers (Columns 2+)
               for (let j = 2; j < row.length; j++) {
                 const optionText = row[j]?.trim();
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
