export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number; // 1-10 scale
  emotions: string[];
  date: string;
  gratitude?: string[];
  goals?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'prompt' | 'crisis';
}

export interface MoodData {
  date: string;
  mood: number;
  emotions: string[];
}

export interface DailyPrompt {
  id: string;
  question: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'mindfulness';
  date: string;
}

export interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  url?: string;
  availability: string;
}