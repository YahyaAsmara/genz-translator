import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { translationAPI } from './services/api';

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

function ApiStatus({ status, onRetry }) {
  const statusConfig = {
    connected: { color: 'green', text: '🟢 API Connected', bgColor: 'bg-green-50 border-green-200' },
    disconnected: { color: 'red', text: '🔴 API Disconnected', bgColor: 'bg-red-50 border-red-200' },
    unknown: { color: 'yellow', text: '🟡 Checking API...', bgColor: 'bg-yellow-50 border-yellow-200' }
  };

  const config = statusConfig[status] || statusConfig.unknown;

  return (
    <div className={`p-3 rounded-lg border ${config.bgColor} mb-4`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{config.text}</span>
        {status === 'disconnected' && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

function TranslationHistory({ translations }) {
  if (!translations || translations.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Translations (From Database)</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {translations.slice(0, 5).map((item, index) => (
          <div key={item.id || index} className="p-3 bg-white rounded-lg border border-gray-200 text-sm">
            <div className="text-blue-600 font-medium">"{item.originalText}"</div>
            <div className="text-gray-700 mt-1">→ {item.translatedText}</div>
            {item.termsFound && item.termsFound.length > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                Terms found: {item.termsFound.join(', ')}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(item.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PopularTerms({ terms }) {
  if (!terms || terms.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Popular Terms</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {terms.slice(0, 8).map((term) => (
          <div key={term.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-purple-700">"{term.genzText}"</span>
                <span className="text-gray-600"> → {term.translation}</span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {term.popularityScore} uses
              </span>
            </div>
            {term.category && (
              <div className="text-xs text-gray-500 mt-1">
                Category: {term.category}
              </div>
            )}
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
  const [popularTerms, setPopularTerms] = useState([]);
  const [termsFound, setTermsFound] = useState([]);
  
  const { translate, getTerms, getHistory, isLoading, error, apiStatus, setError } = useTranslation();

  // Load initial data when API becomes available
  useEffect(() => {
    if (apiStatus === 'connected') {
      loadInitialData();
    }
  }, [apiStatus]);

  const loadInitialData = async () => {
    try {
      // Load popular terms and recent history in parallel
      const [terms, history] = await Promise.all([
        translationAPI.getPopularTerms(),
        translationAPI.getHistory(10)
      ]);
      
      setPopularTerms(terms);
      setTranslationHistory(history);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    try {
      const result = await translate(inputText);
      setTranslatedText(result.translatedText);
      setTermsFound(result.termsFound || []);
      
      // Refresh history to include the new translation
      const updatedHistory = await getHistory(10);
      setTranslationHistory(updatedHistory);
      
      // Update popular terms if any were used
      if (result.termsFound && result.termsFound.length > 0) {
        const updatedTerms = await translationAPI.getPopularTerms();
        setPopularTerms(updatedTerms);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const handleClear = () => {
    setInputText("");
    setTranslatedText("");
    setTermsFound([]);
    setError(null);
  };

  const retryConnection = async () => {
    try {
      await translationAPI.healthCheck();
      await loadInitialData();
    } catch (error) {
      console.error('Retry failed:', error);
    }
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
            Full Stack Version • Real-time Database Integration
          </div>
        </div>

        {/* API Status */}
        <ApiStatus status={apiStatus} onRetry={retryConnection} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-red-700">⚠️ {error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Translation Interface */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Gen Z text:
            </label>
            <div className="flex space-x-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Try: 'no cap bestie, this app is bussin fr fr periodt'"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                disabled={apiStatus === 'disconnected'}
              />
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isLoading || apiStatus === 'disconnected'}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Translating..." : "Translate"}
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

          {/* Terms Found */}
          {termsFound.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Terms Translated:</h4>
              <div className="flex flex-wrap gap-2">
                {termsFound.map((term, index) => (
                  <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Popular Terms */}
        <PopularTerms terms={popularTerms} />

        {/* Translation History */}
        <TranslationHistory translations={translationHistory} />

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">🔧 System Status:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• API Status: <span className="font-mono">{apiStatus}</span></li>
            <li>• Popular Terms Loaded: <span className="font-mono">{popularTerms.length}</span></li>
            <li>• Translation History: <span className="font-mono">{translationHistory.length} records</span></li>
            <li>• API Base URL: <span className="font-mono">{process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}