import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, LogOut } from 'lucide-react'; 
import { useAuthStore } from './lib/auth'; 
import VisionBoardPage from './pages/VisionBoardPage';
import EnergyCheckPage from './pages/EnergyCheckPage';
import ManifestationTrackerPage from './pages/ManifestationTrackerPage';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  const { isAuthenticated, loginWithEmail, logout } = useAuthStore(); 
  const [activePage, setActivePage] = useState('vision-board');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);  // Hier wird der isLogin State definiert

  const pages = [
    { id: 'vision-board', title: 'Vision Board', icon: <Mail className="w-5 h-5" /> },
    { id: 'energy-check', title: 'Energie-Check', icon: <Lock className="w-5 h-5" /> },
    { id: 'manifestation-tracker', title: 'Ziele', icon: <ArrowRight className="w-5 h-5" /> },
    { id: 'recommendations', title: 'Empfehlungen', icon: <LogOut className="w-5 h-5" /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

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
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${activePage === page.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  {page.icon}
                  <span>{page.title}</span>
                </button>
              ))}

              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Abmelden</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <h2 className="text-center text-3xl font-light text-gray-900 dark:text-white">Melde dich an</h2>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">E-Mail</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-3 py-2 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500"
                      placeholder="E-Mail"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Passwort</label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-3 py-2 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-blue-500"
                      placeholder="Passwort"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isLogin ? 'Anmelden' : 'Registrieren'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            {activePage === 'vision-board' && <VisionBoardPage />}
            {activePage === 'energy-check' && <EnergyCheckPage />}
            {activePage === 'manifestation-tracker' && <ManifestationTrackerPage />}
            {activePage === 'recommendations' && <RecommendationsPage />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
