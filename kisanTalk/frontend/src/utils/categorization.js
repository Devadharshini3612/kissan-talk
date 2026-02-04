export const categorizeGrievance = (text) => {
  if (!text) return '';

  const lowerText = text.toLowerCase();

  const categories = {
    'Crop Disease': [
      'disease', 'pest', 'insect', 'worm', 'fungus', 'blight', 'rot', 'spot', 'wilt', 'attack', 'virus', 'bacteria', 'infection',
      'rog', 'kida', 'kit', 'bimari', 'ille', 'fungi', 'sundi'
    ],
    'Irrigation Issue': [
      'water', 'irrigation', 'canal', 'tube well', 'pump', 'borewell', 'drought', 'dry', 'rain', 'pipe', 'leak', 'flow', 'motor',
      'pani', 'sinchai', 'nehar', 'nalkoop', 'sukha', 'barish'
    ],
    'Subsidy/Scheme': [
      'subsidy', 'scheme', 'pm kisan', 'loan', 'bank', 'money', 'fund', 'grant', 'insurance', 'bima', 'yojana', 'account', 'kcc', 'credit card',
      'paisa', 'dhan', 'rakam', 'karz'
    ],
    'Seeds/Fertilizers': [
      'seed', 'fertilizer', 'urea', 'dap', 'manure', 'sowing', 'planting', 'variety', 'hybrid', 'quality', 'shortage', 'npk',
      'beej', 'khad', 'buwai', 'fasal'
    ],
    'Equipment Issue': [
      'tractor', 'machine', 'tool', 'equipment', 'harvester', 'thresher', 'repair', 'breakdown', 'mechanic', 'plow', 'tiller',
      'yantra', 'aujar', 'kharab'
    ],
    'Market Access': [
      'market', 'mandi', 'price', 'rate', 'sell', 'selling', 'transport', 'storage', 'godown', 'msp', 'buyer', 'trader', 'procurement',
      'bhav', 'daam', 'bechna', 'bikri', 'vyapari'
    ]
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
};
