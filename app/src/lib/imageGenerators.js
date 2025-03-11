// Fallback images for when API calls fail or are not available
const fallbackImages = {
  default: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
  ],
  meer: [
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206',
    'https://images.unsplash.com/photo-1484291470158-b8f8d608850d',
  ],
  strand: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206',
    'https://images.unsplash.com/photo-1484291470158-b8f8d608850d',
  ],
  berge: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5',
  ],
  stadt: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
  ],
  erfolg: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721',
  ],
  liebe: [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',
  ],
  familie: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300',
  ],
  reisen: [
    'https://images.unsplash.com/photo-1488085061387-422e29b40080',
    'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81',
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552',
  ],
  gesundheit: [
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  ],
};

// Helper function to find the best matching category for a prompt
const findMatchingCategory = (prompt) => {
  // Convert prompt to lowercase for case-insensitive matching
  const lowerPrompt = prompt.toLowerCase().trim();
  
  // Direct match with a category
  if (fallbackImages[lowerPrompt]) {
    return fallbackImages[lowerPrompt];
  }
  
  // Check if the prompt contains any of our categories
  for (const category of Object.keys(fallbackImages)) {
    if (lowerPrompt.includes(category)) {
      return fallbackImages[category];
    }
  }
  
  // German to English mappings for common terms
  const germanToEnglish = {
    'sea': ['meer', 'ozean', 'see'],
    'beach': ['strand', 'küste'],
    'mountain': ['berg', 'berge', 'gebirge'],
    'city': ['stadt', 'metropole'],
    'success': ['erfolg', 'erfolge', 'erfolgreich'],
    'love': ['liebe', 'herz', 'romantik'],
    'family': ['familie', 'familien'],
    'travel': ['reise', 'reisen', 'urlaub'],
    'health': ['gesundheit', 'gesund', 'fitness', 'wohlbefinden']
  };
  
  // Check for English equivalents
  for (const [english, germanTerms] of Object.entries(germanToEnglish)) {
    if (germanTerms.some(term => lowerPrompt.includes(term))) {
      // Map English term back to our German categories
      switch (english) {
        case 'sea': return fallbackImages.meer;
        case 'beach': return fallbackImages.strand;
        case 'mountain': return fallbackImages.berge;
        case 'city': return fallbackImages.stadt;
        case 'success': return fallbackImages.erfolg;
        case 'love': return fallbackImages.liebe;
        case 'family': return fallbackImages.familie;
        case 'travel': return fallbackImages.reisen;
        case 'health': return fallbackImages.gesundheit;
      }
    }
  }
  
  // Default to random images if no match found
  return fallbackImages.default;
};

export const imageGenerators = {
  local: {
    name: 'Lokale Bilder',
    description: 'Verwendet lokale Bilder basierend auf deiner Beschreibung',
    generate: async (prompt) => {
      // Simulate a delay to make it feel like it's doing something
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find matching images based on the prompt
      const matchingImages = findMatchingCategory(prompt);
      
      // Return a random image from the matching category
      const randomIndex = Math.floor(Math.random() * matchingImages.length);
      return matchingImages[randomIndex];
    },
  },
  unsplash: {
    name: 'Unsplash',
    description: 'Hochwertige Fotos von Unsplash',
    generate: async (prompt) => {
      try {
        return `https://source.unsplash.com/random/1000x1000/?${encodeURIComponent(prompt)}`;
      } catch (error) {
        console.error('Error fetching from Unsplash:', error);
        throw new Error('Fehler beim Abrufen von Unsplash-Bildern');
      }
    },
  }
};