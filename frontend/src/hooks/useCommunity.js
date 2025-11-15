import { useState, useCallback } from 'react';
import { communityAPI } from '../services/api';

const defaultFilter = { persona: '', tag: '', visibility: '' };

export function useCommunity() {
  const [feed, setFeed] = useState([]);
  const [filters, setFilters] = useState(defaultFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async (nextFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const vibes = await communityAPI.getVibes(nextFilters);
      setFeed(vibes);
      setFilters(nextFilters);
    } catch (err) {
      console.error('Failed to load community feed', err);
      setError(err.response?.data?.message || 'Unable to load community feed');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const shareVibe = useCallback(async (payload) => {
    setError(null);
    const vibe = await communityAPI.shareVibe(payload);
    await fetchFeed(filters);
    return vibe;
  }, [fetchFeed, filters]);

  const pulse = useCallback(async (vibeId, pulseType) => {
    const updated = await communityAPI.reactToVibe(vibeId, pulseType);
    setFeed((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    return updated;
  }, []);

  const remix = useCallback(async (vibeId, remixText) => {
    const updated = await communityAPI.remixVibe(vibeId, remixText);
    setFeed((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    return updated;
  }, []);

  return {
    feed,
    filters,
    isLoading,
    error,
    fetchFeed,
    shareVibe,
    pulse,
    remix,
  };
}
