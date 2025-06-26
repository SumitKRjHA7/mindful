import { JournalEntry, ChatMessage } from '../types';

const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'mindful_journal_entries',
  CHAT_HISTORY: 'mindful_chat_history',
  USER_PREFERENCES: 'mindful_user_preferences',
};

export const storage = {
  // Journal entries
  saveJournalEntries: (entries: JournalEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  },

  getJournalEntries: (): JournalEntry[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    if (!stored) return [];
    
    try {
      const entries = JSON.parse(stored);
      return entries.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      }));
    } catch {
      return [];
    }
  },

  // Chat history
  saveChatHistory: (messages: ChatMessage[]) => {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  },

  getChatHistory: (): ChatMessage[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (!stored) return [];
    
    try {
      const messages = JSON.parse(stored);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch {
      return [];
    }
  },

  // User preferences
  saveUserPreferences: (preferences: any) => {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  },

  getUserPreferences: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (!stored) return {};
    
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  },

  // Export data
  exportData: () => {
    const entries = storage.getJournalEntries();
    const chatHistory = storage.getChatHistory();
    const preferences = storage.getUserPreferences();
    
    const data = {
      journalEntries: entries,
      chatHistory,
      preferences,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindful-journal-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};