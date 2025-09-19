import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { translationAPI } from './services/api';

function TranslationCard({ title, text, bgColor }) {
  return (
    <div className={`p-6 rounded-lg ${bgColor} min-h-32`}>
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="text-gray-800 leading-relaxed">
        {text || <span className="text-gray-400 italic">Enter some Gen Z text to translate...</span>}
        {/* API Section */}
        <div className="mt-8 text-center text-zinc-400 text-xs">
          <div className="mb-1">API Status: <span className={apiStatus === 'connected' ? 'text-green-400' : apiStatus === 'disconnected' ? 'text-red-400' : 'text-yellow-400'}>{apiStatus}</span></div>
          <div>API Endpoint: <span className="font-mono text-zinc-300">{process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}</span></div>
        </div>
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
  const { translate, isLoading, error, apiStatus, setError } = useTranslation();

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    try {
      const result = await translate(inputText);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const handleClear = () => {
    setInputText("");
    setTranslatedText("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <div className="w-full max-w-xl p-6 mx-auto flex flex-col min-h-screen justify-center">
        <h1 className="text-3xl font-bold text-center mb-8">Gen Z → Human Translator</h1>
        <div className="mb-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter Gen Z text..."
            className="w-full p-4 rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
            rows={3}
            disabled={apiStatus === 'disconnected'}
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isLoading || apiStatus === 'disconnected'}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              {isLoading ? "Translating..." : "Translate"}
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="rounded bg-zinc-900 border border-zinc-700 p-4 min-h-[80px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          <div className="text-sm text-zinc-400 mb-2">Translation:</div>
          <div className="text-lg font-medium text-white min-h-[32px]">{translatedText || <span className="text-zinc-500 italic">Your translation will appear here.</span>}</div>
        </div>
        {error && (
          <div className="mt-4 bg-red-900 text-red-200 p-3 rounded text-center">
            {error}
          </div>
        )}
        {/* API Section */}
        <div className="mt-8 text-center text-zinc-400 text-xs">
          <div className="mb-1">API Status: <span className={apiStatus === 'connected' ? 'text-green-400' : apiStatus === 'disconnected' ? 'text-red-400' : 'text-yellow-400'}>{apiStatus}</span></div>
          <div>API Endpoint: <span className="font-mono text-zinc-300">{process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}</span></div>
        </div>
      </div>
    </div>
  );
}