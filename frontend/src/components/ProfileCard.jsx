import React from 'react';

export function ProfileCard({ profile, onLogout }) {
  if (!profile) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Persona</p>
          <p className="text-lg font-semibold" style={{ color: profile.accentColor || '#a5b4fc' }}>
            {profile.personaTag || 'Culture Tuner'}
          </p>
          <p className="text-sm text-zinc-400">@{profile.handle}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1 text-sm border border-zinc-600 rounded hover:border-red-400 hover:text-red-300"
        >
          Sign out
        </button>
      </div>
      {profile.bio && (
        <p className="text-sm text-zinc-400 mt-3">{profile.bio}</p>
      )}
      <div className="flex gap-4 text-xs text-zinc-500 mt-4">
        <span>Streak: {profile.streakCount ?? 0}</span>
        <span>Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
