import React, { useState } from 'react';

const initialState = { email: '', password: '', handle: '' };

export function AuthPanel({ onAuthenticate, authError }) {
  const [form, setForm] = useState(initialState);
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onAuthenticate({ ...form, mode });
      setForm(initialState);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{mode === 'login' ? 'Welcome back' : 'Claim your handle'}</h2>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {mode === 'login' ? 'Need an account?' : 'Have credentials?'}
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wide">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-black border border-zinc-700 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {mode === 'register' && (
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wide">Handle</label>
            <input
              type="text"
              name="handle"
              value={form.handle}
              onChange={handleChange}
              minLength={3}
              maxLength={24}
              required
              className="w-full px-3 py-2 bg-black border border-zinc-700 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wide">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
            className="w-full px-3 py-2 bg-black border border-zinc-700 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {authError && (
          <p className="text-sm text-red-400">{authError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700"
        >
          {isSubmitting ? 'Processing...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
