import React, { useState, useEffect } from 'react';
import { PulseLegend } from './VibeFeed';

export function VibeComposer({ originalText, translatedText, onShare, disabled }) {
  const [insight, setInsight] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!originalText) {
      setInsight('');
      setTagsInput('');
      setStatus(null);
    }
  }, [originalText]);

  const handleShare = async () => {
    if (!originalText || !translatedText) return;
    setStatus('sharing');
    const payload = {
      originalText,
      translatedText,
      insight,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      visibility,
    };
    try {
      await onShare(payload);
      setInsight('');
      setTagsInput('');
      setStatus('shared');
      setTimeout(() => setStatus(null), 2500);
    } catch (error) {
      console.error('Failed to share vibe', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Share this translation</h3>
        <PulseLegend compact />
      </div>
      <textarea
        value={insight}
        onChange={(event) => setInsight(event.target.value)}
        placeholder="Add an insight, nudge, or vibe context..."
        className="w-full mb-3 p-3 rounded bg-black border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="tags e.g. slang, remix, hype"
          className="flex-1 px-3 py-2 rounded bg-black border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
          className="px-3 py-2 rounded bg-black border border-zinc-700"
        >
          <option value="PUBLIC">Public Radar</option>
          <option value="FOLLOWING">Following</option>
          <option value="PRIVATE">Private</option>
        </select>
        <button
          disabled={!originalText || !translatedText || disabled || status === 'sharing'}
          onClick={handleShare}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700"
        >
          {status === 'sharing' ? 'Publishing...' : 'Broadcast Vibe'}
        </button>
      </div>
      {status === 'shared' && (
        <p className="text-xs text-green-400 mt-2">Vibe shared to the constellation.</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">Could not share. Try re-authenticating.</p>
      )}
    </div>
  );
}
