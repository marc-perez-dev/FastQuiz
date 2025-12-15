import Papa from 'papaparse';
import type { Question, Option } from '../types';

export const parseCSV = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const questions: Question[] = [];
          const data = results.data as string[][];

          // Empezamos desde la fila 1 (índice 1) asumiendo que la fila 0 es cabecera.
          // Si el usuario dijo que la fila 1 es cabecera obligatoria, la saltamos.
          for (let i = 1; i < data.length; i++) {
            const row = data[i];
            
            // Ignorar filas vacías o que no tengan al menos enunciado y un par de opción
            if (!row || row.length < 3 || !row[0]) continue;

            const statement = row[0].trim();
            if (!statement) continue;

            const options: Option[] = [];
            
            // Iterar pares desde columna 1
            for (let j = 1; j < row.length; j += 2) {
              const optionText = row[j]?.trim();
              
              // Si no hay texto de opción, paramos de leer esta fila (asumiendo fin de datos útiles)
              // O saltamos si es un hueco intermedio (aunque la spec decía detenerse, seremos robustos)
              if (!optionText) continue;

              const isCorrectRaw = row[j + 1]?.trim().toLowerCase();
              // Interpretación laxa de verdadero
              const isCorrect = ['true', 'verdadero', '1', 'si', 'yes', 'v'].includes(isCorrectRaw || '');

              options.push({
                id: crypto.randomUUID(),
                text: optionText,
                isCorrect
              });
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
