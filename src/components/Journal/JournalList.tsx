import React, { useState } from 'react';
import { Search, Plus, Calendar, Heart, Edit3, Trash2, Filter } from 'lucide-react';
import { JournalEntry } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

interface JournalListProps {
  entries: JournalEntry[];
  onNewEntry: () => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const JournalList: React.FC<JournalListProps> = ({
  entries,
  onNewEntry,
  onEditEntry,
  onDeleteEntry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [filterMood, setFilterMood] = useState<'all' | 'low' | 'neutral' | 'high'>('all');

  const filteredEntries = entries.filter(entry => {
    // Text search
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.emotions.some(emotion => emotion.toLowerCase().includes(searchTerm.toLowerCase()));

    // Period filter
    const entryDate = new Date(entry.date);
    const matchesPeriod = filterPeriod === 'all' ||
                         (filterPeriod === 'today' && isToday(entryDate)) ||
                         (filterPeriod === 'week' && isThisWeek(entryDate)) ||
                         (filterPeriod === 'month' && isThisMonth(entryDate));

    // Mood filter
    const matchesMood = filterMood === 'all' ||
                       (filterMood === 'low' && entry.mood <= 3) ||
                       (filterMood === 'neutral' && entry.mood >= 4 && entry.mood <= 7) ||
                       (filterMood === 'high' && entry.mood >= 8);

    return matchesSearch && matchesPeriod && matchesMood;
  });

  const sortedEntries = filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'text-red-500 bg-red-50';
    if (mood <= 7) return 'text-yellow-500 bg-yellow-50';
    return 'text-green-500 bg-green-50';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 3) return '😢';
    if (mood <= 7) return '😐';
    return '😊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Journal</h1>
            <p className="text-gray-600">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} • 
              Track your thoughts, emotions, and growth
            </p>
          </div>
          <Button onClick={onNewEntry} icon={Plus} size="lg" className="mt-4 sm:mt-0">
            New Entry
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Moods</option>
                <option value="low">Low (1-3)</option>
                <option value="neutral">Neutral (4-7)</option>
                <option value="high">High (8-10)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Entries Grid */}
        {sortedEntries.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {entries.length === 0 ? 'Start Your Journey' : 'No matching entries'}
            </h3>
            <p className="text-gray-600 mb-6">
              {entries.length === 0 
                ? 'Begin documenting your thoughts, feelings, and experiences.'
                : 'Try adjusting your search or filters to find what you\'re looking for.'
              }
            </p>
            {entries.length === 0 && (
              <Button onClick={onNewEntry} icon={Plus}>
                Create Your First Entry
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEntries.map((entry) => (
              <Card key={entry.id} hover className="group">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {entry.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(entry.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                      {getMoodEmoji(entry.mood)} {entry.mood}/10
                    </div>
                  </div>

                  {/* Content Preview */}
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {entry.content}
                  </p>

                  {/* Emotions */}
                  {entry.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.emotions.slice(0, 3).map((emotion) => (
                        <span
                          key={emotion}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {emotion}
                        </span>
                      ))}
                      {entry.emotions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{entry.emotions.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-500">
                      {format(entry.updatedAt, 'h:mm a')}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalList;