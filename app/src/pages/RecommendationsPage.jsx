import React, { useState } from 'react';
import { Sparkles, Music, Wind, Brain, Footprints, Video, BookOpen, Heart, Zap, Plus, X, Edit2, Save } from 'lucide-react';
import { useAppStore } from '../store';

function RecommendationsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState(null);
  
  const { energyEntries, getRecommendations, addRecommendation, updateRecommendation, removeRecommendation } = useAppStore();

  const getIconForType = (type) => {
    switch(type) {
      case 'meditation': return <Brain className="text-purple-500" />;
      case 'music': return <Music className="text-blue-500" />;
      case 'breathing': return <Wind className="text-cyan-500" />;
      case 'walk': return <Footprints className="text-green-500" />;
      case 'video': return <Video className="text-orange-500" />;
      case 'reading': return <BookOpen className="text-yellow-500" />;
      case 'productivity': return <Zap className="text-lime-500" />;
      default: return <Heart className="text-red-500" />;
    }
  };

  const activityTypes = [
    { value: 'meditation', label: 'Meditation' },
    { value: 'music', label: 'Musik' },
    { value: 'breathing', label: 'Atemübung' },
    { value: 'walk', label: 'Bewegung' },
    { value: 'video', label: 'Video' },
    { value: 'reading', label: 'Lesen' },
    { value: 'productivity', label: 'Produktivität' }
  ];

  // Get the latest energy level and category
  const getEnergyInfo = () => {
    if (energyEntries.length === 0) return null;
    
    const latestEntry = [...energyEntries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const level = latestEntry.level;
    let category, text, color;
    
    if (level <= 2) {
      category = 'low';
      text = 'Niedrig';
      color = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    } else if (level >= 4) {
      category = 'high';
      text = 'Hoch';
      color = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    } else {
      category = 'medium';
      text = 'Mittel';
      color = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    
    return { level, category, text, color };
  };

  const energyInfo = getEnergyInfo();

  // Show message if no energy level has been entered
  if (!energyInfo) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>Empfehlungen</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Füge zuerst einen Energie-Check hinzu, um personalisierte Empfehlungen zu erhalten.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Trage deinen aktuellen Energie-Level ein, um Empfehlungen zu erhalten.
            </p>
            <a
              href="#/energy-check"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <span>Zum Energie-Check</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Get recommendations for current energy level
  const recommendations = getRecommendations(energyInfo.category);
  const customRecommendations = recommendations.filter(rec => !rec.isDefault);

  const handleAddOrUpdateRecommendation = () => {
    if (!editingRecommendation?.title?.trim() || !editingRecommendation?.description?.trim()) return;

    if (isEditing) {
      updateRecommendation(energyInfo.category, editingRecommendation.id, editingRecommendation);
    } else {
      addRecommendation(energyInfo.category, editingRecommendation);
    }

    setIsEditing(false);
    setEditingRecommendation(null);
  };

  const openEditModal = (recommendation) => {
    setIsEditing(true);
    setEditingRecommendation(recommendation);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingRecommendation({
      title: '',
      description: '',
      type: 'meditation',
      link: '',
      energyLevel: energyInfo.category
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Deine Empfehlungen</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            Basierend auf deinem aktuellen Energie-Level:
            <span className={`px-2 py-0.5 rounded-full ${energyInfo.color}`}>
              Level {energyInfo.level} - {energyInfo.text}
            </span>
          </p>
        </div>
        {customRecommendations.length < 3 && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Neue Empfehlung</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex flex-col relative group"
            >
              {!rec.isDefault && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(rec)}
                    className="p-1 bg-white dark:bg-gray-800 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => removeRecommendation(energyInfo.category, rec.id)}
                    className="p-1 bg-white dark:bg-gray-800 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                  {getIconForType(rec.type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activityTypes.find(t => t.value === rec.type)?.label}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 flex-1">
                {rec.description}
              </p>
              
              {rec.link && (
                <a
                  href={rec.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Jetzt starten
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {editingRecommendation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Empfehlung bearbeiten' : 'Neue Empfehlung'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingRecommendation(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={editingRecommendation.title}
                  onChange={(e) => setEditingRecommendation(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="Titel der Empfehlung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Art der Aktivität
                </label>
                <select
                  value={editingRecommendation.type}
                  onChange={(e) => setEditingRecommendation(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={editingRecommendation.description}
                  onChange={(e) => setEditingRecommendation(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  rows={3}
                  placeholder="Beschreibe die Empfehlung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={editingRecommendation.link}
                  onChange={(e) => setEditingRecommendation(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingRecommendation(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddOrUpdateRecommendation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>{isEditing ? 'Aktualisieren' : 'Hinzufügen'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationsPage;