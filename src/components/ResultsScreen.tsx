import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  onNewFile: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, onRestart, onNewFile }) => {
  const { t } = useTranslation();
  const percentage = Math.round((score / total) * 100);
  
  let message = '';

  if (percentage === 100) {
    message = t('results.perfect');
  } else if (percentage >= 80) {
    message = t('results.excellent');
  } else if (percentage >= 50) {
    message = t('results.good');
  } else {
    message = t('results.practice');
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500 w-full max-w-2xl">
      <h2 className="text-4xl font-bold text-stone-900 mb-2 font-serif">{t('results.title')}</h2>
      <p className="text-xl font-medium mb-12 text-stone-600 italic font-serif">{message}</p>

      <Card variant="result">
        <div className="text-7xl font-bold text-stone-900 tracking-tighter">
          {percentage}%
        </div>
        <div className="text-lg text-stone-500 mt-2 font-mono border-t-2 border-stone-200 pt-2 w-32">
          {score} / {total}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <Button
          onClick={onRestart}
          className="flex-1"
          variant="primary"
        >
          {t('results.retry')}
        </Button>
        <Button
          onClick={onNewFile}
          className="flex-1"
          variant="secondary"
        >
          {t('results.newFile')}
        </Button>
      </div>
    </div>
  );
};