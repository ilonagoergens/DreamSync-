import React, { useState } from 'react';
import { Plus, X, Smile, Frown, Meh, BarChart3, Calendar } from 'lucide-react';
import { useAppStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function EnergyCheckPage() {
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLevel, setSelectedLevel] = useState(3);
  const [notes, setNotes] = useState('');
  const [timeframe, setTimeframe] = useState('week');

  const { energyEntries, addEnergyEntry, removeEnergyEntry, setActivePage } = useAppStore();

  const handleAddEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      level: selectedLevel,
      notes: notes
    };

    addEnergyEntry(newEntry);
    setNotes('');
    setSelectedLevel(3);
    setIsAddingEntry(false);
    
    // Automatically navigate to recommendations page
    setActivePage('recommendations');
  };

  const handleRemoveEntry = (id) => {
    removeEnergyEntry(id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatChartDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getFilteredEntries = () => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return energyEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return energyEntries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getAverageEnergyLevel = (entries) => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.level, 0);
    return (sum / entries.length).toFixed(1);
  };

  const getEnergyLevelIcon = (level) => {
    if (level <= 2) return <Frown className="w-5 h-5" />;
    if (level === 3) return <Meh className="w-5 h-5" />;
    return <Smile className="w-5 h-5" />;
  };

  const getEnergyLevelColor = (level) => {
    if (level <= 2) return 'text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    if (level === 3) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-green-500 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
  };

  const getBarColor = (level) => {
    if (level <= 2) return '#ef4444'; // red-500
    if (level === 3) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  const filteredEntries = getFilteredEntries();
  const chartData = filteredEntries.map(entry => ({
    date: formatChartDate(entry.date),
    level: entry.level,
    color: getBarColor(entry.level),
    fullDate: entry.date
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const entry = payload[0].payload;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">
          {formatDate(entry.fullDate)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`${getEnergyLevelColor(entry.level)} px-2 py-0.5 rounded-full`}>
            Energie-Level: {entry.level}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Energie-Check</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Verfolge dein Energielevel</p>
        </div>
        <button
          onClick={() => setIsAddingEntry(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Neuer Eintrag</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Energie-Verlauf</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                timeframe === 'week'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Woche
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                timeframe === 'month'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Monat
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                timeframe === 'year'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Jahr
            </button>
          </div>
        </div>

        <div className="h-64 mb-6">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  ticks={[1, 2, 3, 4, 5]}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="level" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Keine Daten für den ausgewählten Zeitraum verfügbar
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Durchschnittliche Energie</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {getAverageEnergyLevel(filteredEntries)}/5
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Einträge</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredEntries.length}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Zeitraum</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {timeframe === 'week' ? 'Woche' : timeframe === 'month' ? 'Monat' : 'Jahr'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">Einträge</h3>
        {energyEntries.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Füge deinen ersten Energie-Check hinzu, um deine Energie-Level zu verfolgen.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map(entry => (
              <div 
                key={entry.id}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full ${getEnergyLevelColor(entry.level)} flex items-center justify-center`}>
                  {getEnergyLevelIcon(entry.level)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(entry.date)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-sm ${getEnergyLevelColor(entry.level)}`}>
                      Level {entry.level}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{entry.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveEntry(entry.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Neuer Energie-Eintrag</h3>
              <button onClick={() => setIsAddingEntry(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Datum
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Energie-Level
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`flex-1 py-2 rounded-md ${
                        selectedLevel === level
                          ? getEnergyLevelColor(level)
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notizen (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Wie fühlst du dich heute?"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddingEntry(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddEntry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnergyCheckPage;