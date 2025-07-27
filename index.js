
const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());

// Translation endpoint
app.get('/api/translate', async (req, res) => {
  const { text, to } = req.query;
  
  if (!text || !to) {
    return res.status(400).json({
      error: 'Missing required parameters: text and to'
    });
  }

  try {
    const targetLang = to;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const translationData = await fetchTranslation(url);
    const result = parseTranslationResponse(translationData, text, targetLang);
    
    res.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: 'Translation failed',
      message: error.message
    });
  }
});

// Helper function to fetch translation
function fetchTranslation(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(new Error('Failed to parse translation response'));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Helper function to parse Google Translate response
function parseTranslationResponse(data, originalText, targetLang) {
  if (!data || !data[0] || !data[0][0]) {
    throw new Error('Invalid translation response');
  }
  
  const translatedText = data[0][0][0];
  const detectedLang = data[2] || 'unknown';
  
  return {
    Credits: 'Google Translate Api',
    Hostby: 'Bucu0368 ĐẸP TRAI',
    Status: 'Success',
    originalText: originalText,
    translatedText: translatedText,
    detected: detectedLang,
    target: targetLang
  };
}

// Helper function to get language names
function getLanguageName(code) {
  const languages = {
    'af': 'afrikaans',
    'sq': 'albanian',
    'am': 'amharic',
    'ar': 'arabic',
    'hy': 'armenian',
    'as': 'assamese',
    'ay': 'aymara',
    'az': 'azerbaijani',
    'bm': 'bambara',
    'eu': 'basque',
    'be': 'belarusian',
    'bn': 'bengali',
    'bho': 'bhojpuri',
    'bs': 'bosnian',
    'bg': 'bulgarian',
    'ca': 'catalan',
    'ceb': 'cebuano',
    'zh': 'chinese',
    'zh-cn': 'chinese (simplified)',
    'zh-tw': 'chinese (traditional)',
    'co': 'corsican',
    'hr': 'croatian',
    'cs': 'czech',
    'da': 'danish',
    'dv': 'dhivehi',
    'doi': 'dogri',
    'nl': 'dutch',
    'en': 'english',
    'eo': 'esperanto',
    'et': 'estonian',
    'ee': 'ewe',
    'fil': 'filipino',
    'fi': 'finnish',
    'fr': 'french',
    'fy': 'frisian',
    'gl': 'galician',
    'ka': 'georgian',
    'de': 'german',
    'el': 'greek',
    'gn': 'guarani',
    'gu': 'gujarati',
    'ht': 'haitian creole',
    'ha': 'hausa',
    'haw': 'hawaiian',
    'he': 'hebrew',
    'hi': 'hindi',
    'hmn': 'hmong',
    'hu': 'hungarian',
    'is': 'icelandic',
    'ig': 'igbo',
    'ilo': 'ilocano',
    'id': 'indonesian',
    'ga': 'irish',
    'it': 'italian',
    'ja': 'japanese',
    'jv': 'javanese',
    'kn': 'kannada',
    'kk': 'kazakh',
    'km': 'khmer',
    'rw': 'kinyarwanda',
    'gom': 'konkani',
    'ko': 'korean',
    'kri': 'krio',
    'ku': 'kurdish',
    'ckb': 'kurdish (sorani)',
    'ky': 'kyrgyz',
    'lo': 'lao',
    'la': 'latin',
    'lv': 'latvian',
    'ln': 'lingala',
    'lt': 'lithuanian',
    'lg': 'luganda',
    'lb': 'luxembourgish',
    'mk': 'macedonian',
    'mai': 'maithili',
    'mg': 'malagasy',
    'ms': 'malay',
    'ml': 'malayalam',
    'mt': 'maltese',
    'mi': 'maori',
    'mr': 'marathi',
    'mni-mtei': 'meiteilon (manipuri)',
    'lus': 'mizo',
    'mn': 'mongolian',
    'my': 'myanmar (burmese)',
    'ne': 'nepali',
    'no': 'norwegian',
    'ny': 'nyanja (chichewa)',
    'or': 'odia (oriya)',
    'om': 'oromo',
    'ps': 'pashto',
    'fa': 'persian',
    'pl': 'polish',
    'pt': 'portuguese',
    'pa': 'punjabi',
    'qu': 'quechua',
    'ro': 'romanian',
    'ru': 'russian',
    'sm': 'samoan',
    'sa': 'sanskrit',
    'gd': 'scots gaelic',
    'nso': 'sepedi',
    'sr': 'serbian',
    'st': 'sesotho',
    'sn': 'shona',
    'sd': 'sindhi',
    'si': 'sinhala (sinhalese)',
    'sk': 'slovak',
    'sl': 'slovenian',
    'so': 'somali',
    'es': 'spanish',
    'su': 'sundanese',
    'sw': 'swahili',
    'sv': 'swedish',
    'tl': 'tagalog (filipino)',
    'tg': 'tajik',
    'ta': 'tamil',
    'tt': 'tatar',
    'te': 'telugu',
    'th': 'thai',
    'ti': 'tigrinya',
    'ts': 'tsonga',
    'tr': 'turkish',
    'tk': 'turkmen',
    'ak': 'twi (akan)',
    'uk': 'ukrainian',
    'ur': 'urdu',
    'ug': 'uyghur',
    'uz': 'uzbek',
    'vi': 'vietnamese',
    'cy': 'welsh',
    'xh': 'xhosa',
    'yi': 'yiddish',
    'yo': 'yoruba',
    'zu': 'zulu'
  };
  return languages[code] || code;
}

// Language list endpoint
app.get('/api/language', (req, res) => {
  const languages = {
    Credits: 'Google Translate Api',
    Hostby: 'Bucu0368 ĐẸP TRAI',
    'af': 'afrikaans',
    'sq': 'albanian',
    'am': 'amharic',
    'ar': 'arabic',
    'hy': 'armenian',
    'as': 'assamese',
    'ay': 'aymara',
    'az': 'azerbaijani',
    'bm': 'bambara',
    'eu': 'basque',
    'be': 'belarusian',
    'bn': 'bengali',
    'bho': 'bhojpuri',
    'bs': 'bosnian',
    'bg': 'bulgarian',
    'ca': 'catalan',
    'ceb': 'cebuano',
    'zh': 'chinese',
    'zh-cn': 'chinese (simplified)',
    'zh-tw': 'chinese (traditional)',
    'co': 'corsican',
    'hr': 'croatian',
    'cs': 'czech',
    'da': 'danish',
    'dv': 'dhivehi',
    'doi': 'dogri',
    'nl': 'dutch',
    'en': 'english',
    'eo': 'esperanto',
    'et': 'estonian',
    'ee': 'ewe',
    'fil': 'filipino',
    'fi': 'finnish',
    'fr': 'french',
    'fy': 'frisian',
    'gl': 'galician',
    'ka': 'georgian',
    'de': 'german',
    'el': 'greek',
    'gn': 'guarani',
    'gu': 'gujarati',
    'ht': 'haitian creole',
    'ha': 'hausa',
    'haw': 'hawaiian',
    'he': 'hebrew',
    'hi': 'hindi',
    'hmn': 'hmong',
    'hu': 'hungarian',
    'is': 'icelandic',
    'ig': 'igbo',
    'ilo': 'ilocano',
    'id': 'indonesian',
    'ga': 'irish',
    'it': 'italian',
    'ja': 'japanese',
    'jv': 'javanese',
    'kn': 'kannada',
    'kk': 'kazakh',
    'km': 'khmer',
    'rw': 'kinyarwanda',
    'gom': 'konkani',
    'ko': 'korean',
    'kri': 'krio',
    'ku': 'kurdish',
    'ckb': 'kurdish (sorani)',
    'ky': 'kyrgyz',
    'lo': 'lao',
    'la': 'latin',
    'lv': 'latvian',
    'ln': 'lingala',
    'lt': 'lithuanian',
    'lg': 'luganda',
    'lb': 'luxembourgish',
    'mk': 'macedonian',
    'mai': 'maithili',
    'mg': 'malagasy',
    'ms': 'malay',
    'ml': 'malayalam',
    'mt': 'maltese',
    'mi': 'maori',
    'mr': 'marathi',
    'mni-mtei': 'meiteilon (manipuri)',
    'lus': 'mizo',
    'mn': 'mongolian',
    'my': 'myanmar (burmese)',
    'ne': 'nepali',
    'no': 'norwegian',
    'ny': 'nyanja (chichewa)',
    'or': 'odia (oriya)',
    'om': 'oromo',
    'ps': 'pashto',
    'fa': 'persian',
    'pl': 'polish',
    'pt': 'portuguese',
    'pa': 'punjabi',
    'qu': 'quechua',
    'ro': 'romanian',
    'ru': 'russian',
    'sm': 'samoan',
    'sa': 'sanskrit',
    'gd': 'scots gaelic',
    'nso': 'sepedi',
    'sr': 'serbian',
    'st': 'sesotho',
    'sn': 'shona',
    'sd': 'sindhi',
    'si': 'sinhala (sinhalese)',
    'sk': 'slovak',
    'sl': 'slovenian',
    'so': 'somali',
    'es': 'spanish',
    'su': 'sundanese',
    'sw': 'swahili',
    'sv': 'swedish',
    'tl': 'tagalog (filipino)',
    'tg': 'tajik',
    'ta': 'tamil',
    'tt': 'tatar',
    'te': 'telugu',
    'th': 'thai',
    'ti': 'tigrinya',
    'ts': 'tsonga',
    'tr': 'turkish',
    'tk': 'turkmen',
    'ak': 'twi (akan)',
    'uk': 'ukrainian',
    'ur': 'urdu',
    'ug': 'uyghur',
    'uz': 'uzbek',
    'vi': 'vietnamese',
    'cy': 'welsh',
    'xh': 'xhosa',
    'yi': 'yiddish',
    'yo': 'yoruba',
    'zu': 'zulu'
  };
  
  res.json(languages);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Translation API is running',
    usage: '/api/translate?text=Hello&to=vi',
    endpoints: {
      translate: '/api/translate?text=Hello&to=vi',
      languages: '/api/language'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Translation API server is running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/translate?text=Hello&to=vi`);
});
