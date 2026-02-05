export const categorizeGrievance = (text) => {
  if (!text) return '';

  const lowerText = text.toLowerCase();

  const categories = {
    'Crop Disease': [
      'disease','pest','insect','worm','fungus','blight','rot','spot','wilt','attack','virus','bacteria','infection',
      'rog','kida','kit','bimari','ille','fungi','sundi',
      'कीड़ा','रोग','बिमारी','फफूंदी','कीट','वायरस',
      'ਕੀੜਾ','ਬਿਮਾਰੀ','ਫਫੂੰਦੀ','ਕੀਟ',
      'பூச்சி','நோய்','பூஞ்சை','விஷாணு'
    ],
    'Irrigation Issue': [
      'water','irrigation','canal','tube well','pump','borewell','drought','dry','rain','pipe','leak','flow','motor',
      'pani','sinchai','nehar','nalkoop','sukha','barish',
      'पानी','नहर','सिंचाई','सूखा',
      'ਪਾਣੀ','ਨਹਿਰ','ਸਿੰਚਾਈ',
      'தண்ணீர்','கால்வாய்','நீர்ப்பாசனம்','வறட்சி'
    ],
    'Subsidy/Scheme': [
      'subsidy','scheme','pm kisan','loan','bank','money','fund','grant','insurance','bima','yojana','account','kcc','credit card',
      'paisa','dhan','rakam','karz',
      'पैसा','ऋण','बैंक','योजना','सब्सिडी','किस्त','भुगतान','खाता',
      'ਪੈਸਾ','ਕਰਜ਼ਾ','ਬੈਂਕ','ਯੋਜਨਾ','ਸਬਸਿਡੀ','ਕਿਸ਼ਤ',
      'பணம்','கடன்','வங்கி','திட்டம்','உதவித்தொகை'
    ],
    'Seeds/Fertilizers': [
      'seed','fertilizer','urea','dap','manure','sowing','planting','variety','hybrid','quality','shortage','npk',
      'beej','khad','buwai','fasal',
      'बीज','खाद','बुवाई','उर्वरक',
      'ਬੀਜ','ਖਾਦ','ਬੁਵਾਈ',
      'விதை','உரம்','விதைப்பு'
    ],
    'Equipment Issue': [
      'tractor','machine','tool','equipment','harvester','thresher','repair','breakdown','mechanic','plow','tiller',
      'yantra','aujar','kharab',
      'ट्रैक्टर','मशीन','उपकरण','मरम्मत','खराब',
      'ਟ੍ਰੈਕਟਰ','ਮਸ਼ੀਨ','ਉਪਕਰਣ','ਮੁਰੰਮਤ','ਖਰਾਬ',
      'டிராக்டர்','இயந்திரம்','கருவி','பழுது'
    ],
    'Market Access': [
      'market','mandi','price','rate','sell','selling','transport','storage','godown','msp','buyer','trader','procurement',
      'bhav','daam','bechna','bikri','vyapari',
      'मंडी','भाव','कीमत','बेचना','दर','खरीदार','व्यापारी',
      'ਮੰਡੀ','ਭਾਅ','ਕੀਮਤ','ਵੇਚਣਾ','ਰੇਟ','ਵਪਾਰੀ',
      'சந்தை','விலை','விற்பனை','விகிதம்','வர்த்தகர்','போக்குவரத்து'
    ]
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
};
