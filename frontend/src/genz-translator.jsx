import { useState, useEffect } from "react";

// Mock translation data (will be replaced with API calls)
const mockTranslations = {
  "no cap": "no lie",
  "fr fr": "for real, for real",
  "periodt": "period (end of discussion)",
  "bestie": "best friend",
  "sus": "suspicious",
  "lowkey": "somewhat/kind of",
  "highkey": "very much/obviously",
  "it's giving": "it shows/displays",
  "main character energy": "confident, self-assured behavior",
  "slay": "do something excellently",
  "bet": "okay/yes/sounds good",
  "mid": "mediocre/average",
  "bussin": "really good (usually food)",
  "sheesh": "wow/impressive",
  "ngl": "not going to lie",
  "iykyk": "if you know, you know",
  "say less": "I understand/agreed",
  "vibe check": "assessing someone's mood or energy",
  "hits different": "is uniquely good or special",
  "rent free": "constantly thinking about something"
};

function TranslationCard({ title, text, bgColor }) {
  return (
    <div className={`p-6 rounded-lg ${bgColor} min-h-32`}>
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="text-gray-800 leading-relaxed">
        {text || <span className="text-gray-400 italic">Enter some Gen Z text to translate...</span>}
      </div>
    </div>
  );
}

function TranslationHistory({ translations }) {
  if (translations.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Translations</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {translations.slice(-5).reverse().map((item, index) => (
          <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 text-sm">
            <div className="text-blue-600 font-medium">"{item.original}"</div>
            <div className="text-gray-700 mt-1">→ {item.translated}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GenZTranslatorApp() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translationHistory, setTranslationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simple translation function (will be replaced with API call)
  const translateText = (text) => {
    if (!text.trim()) return "";

    let translated = text.toLowerCase();
    
    // Replace known Gen Z terms
    Object.entries(mockTranslations).forEach(([genz, normal]) => {
      const regex = new RegExp(`\\b${genz.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      translated = translated.replace(regex, normal);
    });

    // Capitalize first letter
    translated = translated.charAt(0).toUpperCase() + translated.slice(1);
    
    return translated;
  };

  // Handle translation with mock API delay
  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = translateText(inputText);
    setTranslatedText(result);
    
    // Add to history
    const newTranslation = {
      original: inputText,
      translated: result,
      timestamp: new Date()
    };
    setTranslationHistory(prev => [...prev, newTranslation]);
    
    setIsLoading(false);
  };

  // Real-time translation as user types (with debounce)
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText("");
      return;
    }

    const timeoutId = setTimeout(() => {
      setTranslatedText(translateText(inputText));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputText]);

  const handleClear = () => {
    setInputText("");
    setTranslatedText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Gen Z → Human Translator
          </h1>
          <p className="text-gray-600 text-lg">
            Decode Gen Z slang and abbreviations into clear, understandable language
          </p>
          <div className="mt-2 text-sm text-gray-500">
            MVP Version • {Object.keys(mockTranslations).length} terms in database
          </div>
        </div>

        {/* Main Translation Interface */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Gen Z text:
            </label>
            <div className="flex space-x-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Try: 'no cap bestie, this app is bussin fr fr'"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
              />
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isLoading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "..." : "Translate"}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Translation Results */}
          <div className="grid md:grid-cols-2 gap-6">
            <TranslationCard
              title="Gen Z Input"
              text={inputText}
              bgColor="bg-purple-50 border border-purple-200"
            />
            <TranslationCard
              title="Human Translation"
              text={translatedText}
              bgColor="bg-blue-50 border border-blue-200"
            />
          </div>
        </div>

        {/* Sample Translations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sample Translations</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-purple-700 font-medium">"no cap fr fr"</div>
                <div className="text-gray-600">→ "no lie for real, for real"</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-purple-700 font-medium">"it's giving main character energy"</div>
                <div className="text-gray-600">→ "it shows confident, self-assured behavior"</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-blue-700 font-medium">"this food is bussin ngl"</div>
                <div className="text-gray-600">→ "this food is really good not going to lie"</div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-blue-700 font-medium">"periodt bestie, say less"</div>
                <div className="text-gray-600">→ "period (end of discussion) best friend, I understand"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Translation History */}
        <TranslationHistory translations={translationHistory} />

        {/* MVP Notice */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">🚀 MVP Features Active:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Real-time translation of {Object.keys(mockTranslations).length} common Gen Z terms</li>
            <li>• Translation history (client-side only)</li>
            <li>• Mock data (will be replaced with PostgreSQL database)</li>
            <li>• Ready for Spring Boot API integration</li>
          </ul>
          
          <h4 className="font-semibold text-yellow-800 mb-2 mt-4">🔜 Coming Next:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Spring Boot REST API backend</li>
            <li>• PostgreSQL database with expanded vocabulary</li>
            <li>• Docker containerization</li>
            <li>• User accounts and favorite translations</li>
            <li>• Crowdsourced term submissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}