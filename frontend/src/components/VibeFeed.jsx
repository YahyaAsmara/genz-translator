import React, { useState } from 'react';

const pulses = [
  { key: 'MIND_BEND', label: '🌀 mindbend' },
  { key: 'HYPE', label: '⚡ hype' },
  { key: 'CHILL', label: '🧊 chill' },
  { key: 'SAGE', label: '🌿 sage' },
  { key: 'COSMIC', label: '✨ cosmic' },
];

export function PulseLegend({ compact = false }) {
  return (
    <div className={`flex ${compact ? 'gap-2 text-xs' : 'gap-3 text-sm'} text-zinc-400`}>
      {pulses.map((pulse) => (
        <span key={pulse.key}>{pulse.label}</span>
      ))}
    </div>
  );
}

export function VibeFeed({ vibes, isLoading, error, onReact, onRemix, onRefresh }) {
  const [activeRemix, setActiveRemix] = useState({ id: null, text: '' });

  const handleRemixSubmit = async (vibeId) => {
    if (!activeRemix.text.trim()) return;
    await onRemix(vibeId, activeRemix.text.trim());
    setActiveRemix({ id: null, text: '' });
  };

  return (
    <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Community Radar</h3>
          <p className="text-sm text-zinc-500">Fresh remixes from the linguanauts.</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-1 text-sm border border-zinc-600 rounded hover:border-blue-400"
        >
          Refresh
        </button>
      </div>
      {isLoading && <p className="text-sm text-zinc-500">Loading vibes...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!isLoading && vibes.length === 0 && (
        <p className="text-sm text-zinc-500">No community drops yet. Be the first to share.</p>
      )}
      <div className="space-y-4">
        {vibes.map((vibe) => (
          <div key={vibe.id} className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/60">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-zinc-400">@{vibe.handle}</p>
                <p className="text-base font-semibold" style={{ color: vibe.accentColor || '#f472b6' }}>
                  {vibe.personaTag}
                </p>
              </div>
              <span className="text-xs text-zinc-500">{new Date(vibe.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-zinc-300">{vibe.originalText}</p>
            <p className="text-lg font-medium text-white mt-1">→ {vibe.translatedText}</p>
            {vibe.insight && <p className="text-sm text-blue-200 mt-2">“{vibe.insight}”</p>}
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mt-3">
              {vibe.tags?.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-zinc-800 rounded-full">#{tag}</span>
              ))}
              <span className="px-2 py-0.5 bg-zinc-800 rounded-full">{vibe.visibility}</span>
              <span className="px-2 py-0.5 bg-zinc-800 rounded-full">Remixes {vibe.remixCount}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {pulses.map((pulse) => (
                <button
                  key={pulse.key}
                  onClick={() => onReact(vibe.id, pulse.key)}
                  className="text-xs px-3 py-1 rounded-full border border-zinc-700 hover:border-blue-400"
                >
                  {pulse.label} ({vibe.pulses?.[pulse.key] || 0})
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeRemix.id === vibe.id ? (
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    autoFocus
                    value={activeRemix.text}
                    onChange={(event) => setActiveRemix({ id: vibe.id, text: event.target.value })}
                    placeholder="Drop your remix"
                    className="flex-1 px-3 py-2 rounded bg-black border border-zinc-700"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemixSubmit(vibe.id)}
                      className="px-3 py-2 rounded bg-blue-600"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => setActiveRemix({ id: null, text: '' })}
                      className="px-3 py-2 rounded border border-zinc-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveRemix({ id: vibe.id, text: '' })}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Remix this translation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
