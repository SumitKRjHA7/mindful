import React, { useState, useEffect } from 'react';
import { JournalEntry, ChatMessage } from './types';
import { storage } from './utils/storage';
import { chatbot } from './utils/chatbot';
import Header from './components/Layout/Header';
import JournalList from './components/Journal/JournalList';
import JournalEditor from './components/Journal/JournalEditor';
import ChatInterface from './components/Chat/ChatInterface';
import MoodTracker from './components/Mood/MoodTracker';
import CrisisSupport from './components/Resources/CrisisSupport';

type Page = 'journal' | 'chat' | 'mood' | 'resources';
type JournalView = 'list' | 'editor';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('journal');
  const [journalView, setJournalView] = useState<JournalView>('list');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data states
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>();

  // Load data on mount
  useEffect(() => {
    setJournalEntries(storage.getJournalEntries());
    setChatMessages(storage.getChatHistory());
    
    // Send welcome message if no chat history
    const existingMessages = storage.getChatHistory();
    if (existingMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hello! I'm your mindful companion. I'm here to provide emotional support, listen to your concerns, and help you process your feelings. 

How are you feeling today? Feel free to share what's on your mind - whether it's something that's bothering you, a success you'd like to celebrate, or just how your day is going.`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      const promptMessage: ChatMessage = {
        id: 'daily-prompt',
        content: chatbot.getDailyPrompt(),
        sender: 'bot',
        timestamp: new Date(),
        type: 'prompt'
      };
      
      setChatMessages([welcomeMessage, promptMessage]);
      storage.saveChatHistory([welcomeMessage, promptMessage]);
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    storage.saveJournalEntries(journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    storage.saveChatHistory(chatMessages);
  }, [chatMessages]);

  // Journal functions
  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingEntry) {
      // Update existing entry
      const updatedEntry: JournalEntry = {
        ...editingEntry,
        ...entryData,
        updatedAt: now
      };
      
      setJournalEntries(prev => 
        prev.map(entry => entry.id === editingEntry.id ? updatedEntry : entry)
      );
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        ...entryData,
        createdAt: now,
        updatedAt: now
      };
      
      setJournalEntries(prev => [newEntry, ...prev]);
    }
    
    setJournalView('list');
    setEditingEntry(undefined);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setJournalView('editor');
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleNewEntry = () => {
    setEditingEntry(undefined);
    setJournalView('editor');
  };

  const handleCancelEdit = () => {
    setEditingEntry(undefined);
    setJournalView('list');
  };

  // Chat functions
  const handleSendMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  // Page navigation
  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    
    // Reset journal view when leaving journal page
    if (page !== 'journal') {
      setJournalView('list');
      setEditingEntry(undefined);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'journal':
        if (journalView === 'editor') {
          return (
            <JournalEditor
              entry={editingEntry}
              onSave={handleSaveEntry}
              onCancel={handleCancelEdit}
            />
          );
        }
        return (
          <JournalList
            entries={journalEntries}
            onNewEntry={handleNewEntry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        );
      
      case 'chat':
        return (
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        );
      
      case 'mood':
        return <MoodTracker entries={journalEntries} />;
      
      case 'resources':
        return <CrisisSupport />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;