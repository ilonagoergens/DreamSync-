import React, { useState } from 'react';
import { Target, BarChart3, ListChecks, Sparkles } from 'lucide-react';
import VisionBoardPage from './pages/VisionBoardPage';
import EnergyCheckPage from './pages/EnergyCheckPage';
import ManifestationTrackerPage from './pages/ManifestationTrackerPage';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  const [activePage, setActivePage] = useState('vision-board');

  const pages = [
    { id: 'vision-board', title: 'Vision Board', icon: <Target className="w-5 h-5" /> },
    { id: 'energy-check', title: 'Energie-Check', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'manifestation-tracker', title: 'Ziele', icon: <ListChecks className="w-5 h-5" /> },
    { id: 'recommendations', title: 'Empfehlungen', icon: <Sparkles className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-light text-gray-900 dark:text-white">💫 DreamSync</h1>
            </div>
            <div className="flex space-x-4">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activePage === page.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {page.icon}
                  <span>{page.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activePage === 'vision-board' && <VisionBoardPage />}
        {activePage === 'energy-check' && <EnergyCheckPage />}
        {activePage === 'manifestation-tracker' && <ManifestationTrackerPage />}
        {activePage === 'recommendations' && <RecommendationsPage />}
      </main>
    </div>
  );
}

export default App;