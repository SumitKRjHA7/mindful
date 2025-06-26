import React, { useState, useEffect } from 'react';
import { Save, X, Heart, Smile, Meh, Frown, Calendar } from 'lucide-react';
import { JournalEntry } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';
import { format } from 'date-fns';

interface JournalEditorProps {
  entry?: JournalEntry;
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const moodIcons = [
  { value: 1, icon: Frown, color: 'text-red-500', label: 'Very Low' },
  { value: 2, icon: Frown, color: 'text-red-400', label: 'Low' },
  { value: 3, icon: Frown, color: 'text-orange-500', label: 'Below Average' },
  { value: 4, icon: Meh, color: 'text-orange-400', label: 'Slightly Low' },
  { value: 5, icon: Meh, color: 'text-yellow-500', label: 'Neutral' },
  { value: 6, icon: Meh, color: 'text-yellow-400', label: 'Okay' },
  { value: 7, icon: Smile, color: 'text-green-400', label: 'Good' },
  { value: 8, icon: Smile, color: 'text-green-500', label: 'Great' },
  { value: 9, icon: Smile, color: 'text-green-600', label: 'Excellent' },
  { value: 10, icon: Heart, color: 'text-pink-500', label: 'Amazing' },
];

const commonEmotions = [
  'Happy', 'Sad', 'Anxious', 'Excited', 'Grateful', 'Frustrated',
  'Peaceful', 'Overwhelmed', 'Hopeful', 'Tired', 'Energetic', 'Stressed',
  'Content', 'Lonely', 'Proud', 'Worried', 'Calm', 'Angry'
];

const JournalEditor: React.FC<JournalEditorProps> = ({ entry, onSave, onCancel }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || 5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(entry?.emotions || []);
  const [gratitude, setGratitude] = useState<string[]>(entry?.gratitude || ['', '', '']);
  const [goals, setGoals] = useState<string[]>(entry?.goals || ['', '', '']);
  const [date, setDate] = useState(entry?.date || format(new Date(), 'yyyy-MM-dd'));

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...gratitude];
    newGratitude[index] = value;
    setGratitude(newGratitude);
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      mood,
      emotions: selectedEmotions,
      date,
      gratitude: gratitude.filter(g => g.trim()),
      goals: goals.filter(g => g.trim()),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {entry ? 'Edit Entry' : 'New Journal Entry'}
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel} icon={X}>
              Cancel
            </Button>
            <Button onClick={handleSave} icon={Save} disabled={!title.trim() || !content.trim()}>
              Save Entry
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      label="Entry Title"
                      placeholder="What's on your mind today?"
                      value={title}
                      onChange={setTitle}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      label="Date"
                      type="date"
                      value={date}
                      onChange={setDate}
                    />
                  </div>
                </div>
                
                <Input
                  label="Write your thoughts..."
                  type="textarea"
                  placeholder="Express yourself freely. This is your safe space to reflect, process emotions, and document your journey."
                  value={content}
                  onChange={setContent}
                  rows={12}
                  required
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Tracker */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {moodIcons.map(({ value, icon: Icon, color, label }) => (
                    <button
                      key={value}
                      onClick={() => setMood(value)}
                      className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                        mood === value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={label}
                    >
                      <Icon className={`w-6 h-6 mx-auto ${color}`} />
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    {moodIcons.find(m => m.value === mood)?.label} ({mood}/10)
                  </span>
                </div>
              </div>
            </Card>

            {/* Emotions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select emotions</h3>
              <div className="flex flex-wrap gap-2">
                {commonEmotions.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => handleEmotionToggle(emotion)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      selectedEmotions.includes(emotion)
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </Card>

            {/* Gratitude */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Three things I'm grateful for</h3>
              <div className="space-y-3">
                {gratitude.map((item, index) => (
                  <Input
                    key={index}
                    placeholder={`Gratitude ${index + 1}...`}
                    value={item}
                    onChange={(value) => handleGratitudeChange(index, value)}
                  />
                ))}
              </div>
            </Card>

            {/* Goals */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's intentions</h3>
              <div className="space-y-3">
                {goals.map((goal, index) => (
                  <Input
                    key={index}
                    placeholder={`Goal ${index + 1}...`}
                    value={goal}
                    onChange={(value) => handleGoalChange(index, value)}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;