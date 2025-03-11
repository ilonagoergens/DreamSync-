import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Target, Briefcase, Heart, Users, Sparkles, Upload, Download, Move, ChevronsUpDown } from 'lucide-react';
import { Rnd } from 'react-rnd';
import { toPng } from 'html-to-image';

function VisionBoardPage() {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedSection, setSelectedSection] = useState('career');
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const fileInputRef = useRef(null);
  const visionBoardRef = useRef(null);
  const sectionRefs = useRef({});

  const sections = [
    {
      id: 'career',
      title: 'Karriere & Finanzen',
      description: 'Berufliche Ziele und finanzielle Wünsche',
      icon: 'Briefcase'
    },
    {
      id: 'relationships',
      title: 'Beziehungen & Liebe',
      description: 'Partnerschaft, Familie und Freundschaften',
      icon: 'Heart'
    },
    {
      id: 'personal',
      title: 'Persönliches Wachstum',
      description: 'Selbstentwicklung, Bildung und Spiritualität',
      icon: 'Sparkles'
    },
    {
      id: 'health',
      title: 'Gesundheit & Wohlbefinden',
      description: 'Körperliche und mentale Gesundheit',
      icon: 'Users'
    }
  ];

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('visionBoardItems');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading vision board items:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('visionBoardItems', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving vision board items:', error);
      }
    }
  }, [items, isLoaded]);

  const handleAddItem = () => {
    if (!uploadedImage) return;
    
    const sectionElement = sectionRefs.current[selectedSection];
    let initialX = 10;
    let initialY = 10;
    
    if (sectionElement) {
      const sectionWidth = sectionElement.clientWidth - 150;
      const sectionHeight = sectionElement.clientHeight - 150;
      
      initialX = Math.max(0, Math.floor(Math.random() * sectionWidth));
      initialY = Math.max(0, Math.floor(Math.random() * sectionHeight));
    }
    
    const newItem = {
      id: Date.now().toString(),
      imageUrl: uploadedImage,
      section: selectedSection,
      text: newItemText,
      width: 150,
      height: 150,
      x: initialX,
      y: initialY,
      zIndex: Math.max(0, ...items.map(item => item.zIndex)) + 1
    };
    
    setItems(prevItems => [...prevItems, newItem]);
    setNewItemText('');
    setUploadedImage(null);
    setIsAddingItem(false);
  };

  const handleRemoveItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
    if (activeItemId === id) {
      setActiveItemId(null);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    const validFiles = fileArray.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Datei "${file.name}" ist zu groß. Maximale Größe ist 5MB.`);
        return false;
      }

      if (!file.type.startsWith('image/')) {
        alert(`Datei "${file.name}" ist kein Bild.`);
        return false;
      }

      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        
        const sectionElement = sectionRefs.current[selectedSection];
        let initialX = 10;
        let initialY = 10;
        
        if (sectionElement) {
          const sectionWidth = sectionElement.clientWidth - 150;
          const sectionHeight = sectionElement.clientHeight - 150;
          
          initialX = Math.max(0, Math.floor(Math.random() * sectionWidth));
          initialY = Math.max(0, Math.floor(Math.random() * sectionHeight));
        }
        
        const newItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          imageUrl: result,
          section: selectedSection,
          text: newItemText,
          width: 150,
          height: 150,
          x: initialX,
          y: initialY,
          zIndex: Math.max(0, ...items.map(item => item.zIndex)) + 1
        };
        
        setItems(prevItems => [...prevItems, newItem]);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
    
    if (validFiles.length > 0) {
      setIsAddingItem(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getItemsForSection = (sectionId) => {
    return items.filter(item => item.section === sectionId);
  };

  const bringToFront = (id) => {
    setItems(prevItems => {
      const maxZIndex = Math.max(0, ...prevItems.map(item => item.zIndex));
      return prevItems.map(item => 
        item.id === id ? { ...item, zIndex: maxZIndex + 1 } : item
      );
    });
  };

  const handleItemActivate = (id) => {
    setActiveItemId(id);
    bringToFront(id);
  };

  const downloadVisionBoard = async () => {
    if (!visionBoardRef.current) return;
    
    try {
      setIsDownloading(true);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `vision-board-${timestamp}.png`;
      
      const dataUrl = await toPng(visionBoardRef.current, {
        quality: 0.95,
        backgroundColor: '#f9fafb',
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading vision board:', error);
      alert('Beim Herunterladen des Vision Boards ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'Heart':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'Users':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  const moveItemToSection = (itemId, targetSectionId) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const sectionElement = sectionRefs.current[targetSectionId];
          let newX = item.x;
          let newY = item.y;
          
          if (sectionElement) {
            const sectionWidth = sectionElement.clientWidth - item.width;
            const sectionHeight = sectionElement.clientHeight - item.height;
            
            newX = Math.max(0, Math.floor(Math.random() * sectionWidth));
            newY = Math.max(0, Math.floor(Math.random() * sectionHeight));
          }
          
          return {
            ...item,
            section: targetSectionId,
            x: newX,
            y: newY,
            zIndex: Math.max(0, ...prevItems.map(i => i.zIndex)) + 1
          };
        }
        return item;
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Mein Vision Board</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Visualisiere deine Ziele und Träume in verschiedenen Lebensbereichen</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadVisionBoard}
            disabled={isDownloading || items.length === 0}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              isDownloading || items.length === 0
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Download size={18} />
            <span>{isDownloading ? 'Wird heruntergeladen...' : 'Herunterladen'}</span>
          </button>
          <button
            onClick={() => setIsAddingItem(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Neues Bild</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">Tipp:</strong> Du kannst Bilder völlig frei positionieren und in der Größe anpassen:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
          <li>Ziehe ein Bild an eine beliebige Position</li>
          <li>Nutze die Ecken und Kanten, um die Größe zu ändern</li>
          <li>Verschiebe Bilder zwischen den Bereichen mit dem Bereichsauswahl-Menü</li>
          <li>Klicke auf ein Bild, um es in den Vordergrund zu bringen</li>
        </ul>
      </div>

      <div 
        ref={visionBoardRef} 
        className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg"
      >
        {sections.map((section) => (
          <div 
            key={section.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
          >
            <div className="flex items-center gap-2 mb-2 opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {getIconComponent(section.icon)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-600 dark:text-gray-300">{section.title}</span>
              </div>
            </div>
            
            <div 
              ref={(el) => sectionRefs.current[section.id] = el}
              className="relative min-h-[400px] rounded-lg bg-gray-50 dark:bg-gray-700/50 overflow-hidden"
              onClick={() => setActiveItemId(null)}
            >
              {getItemsForSection(section.id).map((item) => (
                <Rnd
                  key={item.id}
                  default={{
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height
                  }}
                  position={{ x: item.x, y: item.y }}
                  size={{ width: item.width, height: item.height }}
                  style={{ 
                    zIndex: item.zIndex,
                    border: activeItemId === item.id ? '2px solid #3b82f6' : 'none'
                  }}
                  onDragStart={() => handleItemActivate(item.id)}
                  onResizeStart={() => handleItemActivate(item.id)}
                  onDragStop={(e, d) => {
                    setItems(prevItems => 
                      prevItems.map(i => 
                        i.id === item.id ? { ...i, x: d.x, y: d.y } : i
                      )
                    );
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    setItems(prevItems => 
                      prevItems.map(i => 
                        i.id === item.id ? { 
                          ...i, 
                          width: parseInt(ref.style.width), 
                          height: parseInt(ref.style.height),
                          x: position.x,
                          y: position.y
                        } : i
                      )
                    );
                  }}
                  className="group"
                  bounds="parent"
                  resizeHandleComponent={{
                    bottomRight: (
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-white/80 dark:bg-gray-800/80 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ChevronsUpDown size={14} className="rotate-45 text-gray-700 dark:text-gray-300" />
                      </div>
                    )
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemActivate(item.id);
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                    
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                        className="bg-white/80 dark:bg-gray-800/80 p-1 rounded-full hover:bg-white dark:hover:bg-gray-700"
                      >
                        <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(selectedItemId === item.id ? null : item.id);
                          }}
                          className="bg-white/80 dark:bg-gray-800/80 p-1 rounded-full hover:bg-white dark:hover:bg-gray-700"
                        >
                          <Move className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        
                        {selectedItemId === item.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                            <div className="py-1">
                              <p className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Verschieben nach:</p>
                              {sections.map((sec) => (
                                <button
                                  key={sec.id}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    sec.id === item.section 
                                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (sec.id !== item.section) {
                                      moveItemToSection(item.id, sec.id);
                                    }
                                    setSelectedItemId(null);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {getIconComponent(sec.icon)}
                                    <span>{sec.title}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {item.text && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm rounded-b-lg">
                        {item.text}
                      </div>
                    )}
                  </div>
                </Rnd>
              ))}
              
              {getItemsForSection(section.id).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Bilder hierher ziehen
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAddingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Neues Bild hinzufügen</h3>
              <button onClick={() => setIsAddingItem(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lebensbereich
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="itemText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beschreibung (optional)
                </label>
                <input
                  type="text"
                  id="itemText"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Kurze Beschreibung oder Zitat"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Bilder hochladen</h4>
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Klicke hier, um ein oder mehrere Bilder von deinem Computer hochzuladen
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, GIF bis zu 5MB pro Bild</p>
                </div>
              </div>

              {uploadedImage && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hochgeladenes Bild:</p>
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Hochgeladenes Bild" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full hover:bg-white dark:hover:bg-gray-700"
                    >
                      <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsAddingItem(false);
                    setUploadedImage(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  disabled={!uploadedImage}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisionBoardPage;