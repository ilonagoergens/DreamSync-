import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useTrackingStore } from '../lib/tracking';

const TrackingExport = () => {
  const { exportToCSV, clearTrackingData } = useTrackingStore();

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
      >
        <Download size={16} />
        <span>Tracking-Daten exportieren</span>
      </button>
      <button
        onClick={() => {
          if (window.confirm('Möchtest du wirklich alle Tracking-Daten löschen?')) {
            clearTrackingData();
          }
        }}
        className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
      >
        <Trash2 size={16} />
        <span>Daten löschen</span>
      </button>
    </div>
  );
};

export default TrackingExport;