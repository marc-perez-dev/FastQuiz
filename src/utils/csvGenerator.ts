import type { Question } from '../types';

export const generateCSV = (questions: Question[]): string => {
  // Cabecera compatible con tu parser (formato Standard)
  const header = ['Pregunta', 'Opción 1', 'Correcta?', 'Opción 2', 'Correcta?', 'Opción 3', 'Correcta?', 'Opción 4', 'Correcta?'];
  
  const rows = questions.map(q => {
    // Escapar comillas dobles en el enunciado duplicándolas
    const statementEscaped = q.statement.split('"').join('""');
    const row: string[] = [`"${statementEscaped}"`];

    // Añadimos las opciones y sus booleanos
    q.options.forEach(opt => {
      const optEscaped = opt.text.split('"').join('""');
      row.push(`"${optEscaped}"`);
      row.push(opt.isCorrect ? 'TRUE' : 'FALSE');
    });

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

