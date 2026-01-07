import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DraftData<T> {
  data: T;
  savedAt: number;
  planId?: string;
}

interface UseFormDraftReturn<T> {
  hasDraft: boolean;
  draftData: T | null;
  savedAt: Date | null;
  saveDraft: (data: T) => void;
  loadDraft: () => T | null;
  clearDraft: () => void;
  restoreDraft: () => void;
  dismissDraft: () => void;
  showRestorePrompt: boolean;
}

export function useFormDraft<T>(
  storageKey: string,
  planId?: string,
  expirationHours: number = 24
): UseFormDraftReturn<T> {
  const { toast } = useToast();
  const [hasDraft, setHasDraft] = useState(false);
  const [draftData, setDraftData] = useState<T | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const fullKey = `form_draft_${storageKey}${planId ? `_${planId}` : ''}`;

  // Check for existing draft on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(fullKey);
      if (stored) {
        const draft: DraftData<T> = JSON.parse(stored);
        const expirationMs = expirationHours * 60 * 60 * 1000;
        const isExpired = Date.now() - draft.savedAt > expirationMs;
        
        if (isExpired) {
          localStorage.removeItem(fullKey);
          return;
        }

        if (draft.planId !== planId) {
          return;
        }

        setHasDraft(true);
        setDraftData(draft.data);
        setSavedAt(new Date(draft.savedAt));
        setShowRestorePrompt(true);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, [fullKey, planId, expirationHours]);

  // Save draft with debounce
  const saveDraft = useCallback((data: T) => {
    try {
      const draft: DraftData<T> = {
        data,
        savedAt: Date.now(),
        planId,
      };
      localStorage.setItem(fullKey, JSON.stringify(draft));
      setHasDraft(true);
      setDraftData(data);
      setSavedAt(new Date());
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [fullKey, planId]);

  // Load draft data
  const loadDraft = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(fullKey);
      if (stored) {
        const draft: DraftData<T> = JSON.parse(stored);
        return draft.data;
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return null;
  }, [fullKey]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(fullKey);
      setHasDraft(false);
      setDraftData(null);
      setSavedAt(null);
      setShowRestorePrompt(false);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [fullKey]);

  // Restore draft (user action)
  const restoreDraft = useCallback(() => {
    setShowRestorePrompt(false);
    toast({
      title: "טיוטה שוחזרה! ✨",
      description: "הנתונים הקודמים שלך שוחזרו בהצלחה",
    });
  }, [toast]);

  // Dismiss the restore prompt
  const dismissDraft = useCallback(() => {
    setShowRestorePrompt(false);
    clearDraft();
    toast({
      title: "טיוטה נמחקה",
      description: "מתחילים טופס חדש",
    });
  }, [clearDraft, toast]);

  return {
    hasDraft,
    draftData,
    savedAt,
    saveDraft,
    loadDraft,
    clearDraft,
    restoreDraft,
    dismissDraft,
    showRestorePrompt,
  };
}

export default useFormDraft;
