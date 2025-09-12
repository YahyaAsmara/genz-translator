import { useState, useEffect, useCallback } from 'react';
import { translationAPI } from '../services/api';

export const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'connected', 'disconnected', 'unknown'

  // Check API health on mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await translationAPI.healthCheck();
        setApiStatus('connected');
        console.log('✅ API is connected');
      } catch (error) {
        setApiStatus('disconnected');
        console.log('❌ API is disconnected');
      }
    };

    checkApiHealth();
  }, []);

  const translate = useCallback(async (text) => {
    if (!text.trim()) return null;

    setIsLoading(true);
    setError(null);

    try {
      const result = await translationAPI.translate(text);
      setApiStatus('connected');
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      setError(error.message || 'Translation failed');
      setApiStatus('disconnected');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTerms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const terms = await translationAPI.getAllTerms();
      setApiStatus('connected');
      return terms;
    } catch (error) {
      console.error('Get terms error:', error);
      setError(error.message || 'Failed to fetch terms');
      setApiStatus('disconnected');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHistory = useCallback(async (limit = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await translationAPI.getHistory(limit);
      setApiStatus('connected');
      return history;
    } catch (error) {
      console.error('Get history error:', error);
      setError(error.message || 'Failed to fetch history');
      setApiStatus('disconnected');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    translate,
    getTerms,
    getHistory,
    isLoading,
    error,
    apiStatus,
    setError
  };
};