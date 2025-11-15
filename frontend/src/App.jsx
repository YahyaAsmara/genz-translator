import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { translationAPI } from './services/api';
import { AuthPanel } from './components/AuthPanel';
import { ProfileCard } from './components/ProfileCard';
import { VibeComposer } from './components/VibeComposer';
import { VibeFeed } from './components/VibeFeed';
import { useAuth } from './context/AuthContext';
import { useCommunity } from './hooks/useCommunity';

export default function GenZTranslatorApp() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [history, setHistory] = useState([]);
  const { translate, isLoading, error, apiStatus, setError } = useTranslation();
  const { profile, authenticate, authError, logout, isInitializing } = useAuth();
  const { feed, fetchFeed, shareVibe, pulse, remix, isLoading: feedLoading, error: feedError } = useCommunity();

  const statusMap = {
    connected: {
      label: 'API live',
      style: 'bg-green-500/10 text-green-300 border-green-500/30',
    },
    disconnected: {
      label: 'API disconnected',
      style: 'bg-red-500/10 text-red-300 border-red-500/30',
    },
    checking: {
      label: 'Checking link…',
      style: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/30',
    },
  };

  useEffect(() => {
    translationAPI.getHistory(6).then(setHistory).catch(() => {});
  }, []);

  useEffect(() => {
    if (profile) {
      fetchFeed();
    }
  }, [profile, fetchFeed]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    try {
      const result = await translate(inputText);
      setTranslatedText(result.translatedText);
    } catch (err) {
      console.error('Translation failed:', err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError(null);
  };

  const handleShare = async (payload) => {
    await shareVibe(payload);
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center" id="hero">
          <div className="space-y-6">
            <span className="text-sm uppercase tracking-[0.25em] text-blue-300">Gen Z → Human Translator</span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">Drop the slang. Ship the meaning.</h1>
            <p className="text-lg text-zinc-300 max-w-xl">
              Translate Gen Z streams into business-ready language, remix the vibes, and pulse with the community — all from one cockpit.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-1 rounded-full border text-sm font-semibold ${statusMap[apiStatus]?.style || statusMap.checking.style}`}>
                {statusMap[apiStatus]?.label || statusMap.checking.label}
              </span>
              <a href="#console" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-semibold">
                Launch translator
              </a>
              {!profile && (
                <span className="text-sm text-zinc-500">Sign in to drop vibes + save personas.</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-zinc-400">
              <div>
                <p className="text-3xl font-bold text-white">120+</p>
                <p>slang entries curated</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Realtime</p>
                <p>translation latency</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">JWT</p>
                <p>secure personas</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-blue-900/20 backdrop-blur">
            {profile ? (
              <ProfileCard profile={profile} onLogout={logout} />
            ) : (
              !isInitializing && <AuthPanel onAuthenticate={authenticate} authError={authError} />
            )}
            <p className="text-xs text-zinc-500 text-center mt-4">Login unlocks vibe sharing, remix threads, and persona streaks.</p>
          </div>
        </section>

        <section id="console" className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-zinc-500 tracking-[0.3em]">Console</p>
                <h2 className="text-2xl font-semibold">Vibe-to-Meaning panel</h2>
              </div>
              <button
                onClick={handleClear}
                className="text-xs px-3 py-1 border border-zinc-700 rounded-full hover:border-blue-400"
              >
                Reset input
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Drop Gen Z snippets, we decode."
              className="w-full p-4 rounded-2xl bg-black border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/60 resize-none"
              rows={5}
              disabled={apiStatus === 'disconnected'}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isLoading || apiStatus === 'disconnected'}
                className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-400 font-semibold"
              >
                {isLoading ? 'Translating…' : 'Translate now'}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-3 rounded-2xl border border-zinc-700"
              >
                Clear
              </button>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-5 min-h-[120px]">
              <p className="text-xs text-zinc-500 uppercase mb-2">Translation</p>
              <p className="text-2xl font-semibold leading-snug">
                {translatedText || <span className="text-zinc-600">Awaiting decoding...</span>}
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 bg-zinc-950/70 border border-zinc-900 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase text-zinc-500">Signal log</p>
                <h3 className="text-xl font-semibold">Recent translations</h3>
              </div>
              <button
                onClick={() => translationAPI.getHistory(6).then(setHistory).catch(() => {})}
                className="text-xs px-3 py-1 rounded-full border border-zinc-700"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {history.length === 0 && (
                <p className="text-sm text-zinc-500">No translations yet. Drop your first vibe.</p>
              )}
              {history.map((item) => (
                <div key={item.id} className="border border-zinc-800 rounded-2xl p-4 bg-black/40">
                  <p className="text-sm text-zinc-400">{item.originalText}</p>
                  <p className="text-base text-white font-semibold">→ {item.translatedText}</p>
                  <p className="text-xs text-zinc-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {profile && (
          <div className="bg-black/40 border border-zinc-900 rounded-3xl p-6">
            <VibeComposer
              originalText={inputText}
              translatedText={translatedText}
              onShare={handleShare}
              disabled={!translatedText}
            />
          </div>
        )}

        <VibeFeed
          vibes={profile ? feed : []}
          isLoading={feedLoading && profile}
          error={profile ? feedError : 'Sign in to access the vibe radar.'}
          onReact={(id, pulseType) => pulse(id, pulseType)}
          onRemix={(id, text) => remix(id, text)}
          onRefresh={() => profile && fetchFeed()}
        />
      </div>
    </div>
  );
}