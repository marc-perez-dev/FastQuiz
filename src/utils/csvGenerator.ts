import type { Question } from '../types';

export const generateCSV = (questions: Question[]): string => {
  // Cabecera simplificada
  const header = ['Pregunta', 'Opción 1', 'Correcta?', 'Opción 2', 'Correcta?', '...'];
  
  const rows = questions.map(q => {
    // Escapar comillas dobles duplicándolas
    const escape = (text: string) => `"${text.split('"').join('""')}"`;
    
    const row: string[] = [escape(q.statement)];

    // Añadimos las opciones y sus booleanos
    q.options.forEach(opt => {
      row.push(escape(opt.text));
      row.push(opt.isCorrect ? 'TRUE' : 'FALSE');
    });

    // Si hay explicación, la añadimos al final. 
    // Como 1 (statement) + 2*N (options) es impar, añadir la explicación 
    // hace que la fila sea par, activando la detección en el parser.
    if (q.explanation) {
      row.push(escape(q.explanation));
    }

    return row.join(',');
  });

  return [header.join(','), ...rows].join('\n');
};

export const downloadCSV = (content: string, filename: string = 'quiz-fastquiz.csv') => {
  // Crear un Blob y forzar la descarga en el navegador
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

