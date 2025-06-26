import React, { useMemo } from 'react';
import { Calendar, TrendingUp, Heart, Smile, Meh, Frown, BarChart3 } from 'lucide-react';
import { JournalEntry } from '../../types';
import Card from '../UI/Card';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MoodTrackerProps {
  entries: JournalEntry[];
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ entries }) => {
  const moodData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    return last30Days.map(date => {
      const dayEntries = entries.filter(entry => 
        format(new Date(entry.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length
        : null;

      return {
        date: format(date, 'MM/dd'),
        fullDate: format(date, 'yyyy-MM-dd'),
        mood: avgMood,
        entries: dayEntries.length,
        isToday: isToday(date)
      };
    });
  }, [entries]);

  const emotionFrequency = useMemo(() => {
    const emotions: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      entry.emotions.forEach(emotion => {
        emotions[emotion] = (emotions[emotion] || 0) + 1;
      });
    });

    return Object.entries(emotions)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [entries]);

  const moodStats = useMemo(() => {
    if (entries.length === 0) return { average: 0, trend: 0, total: 0 };

    const total = entries.length;
    const average = entries.reduce((sum, entry) => sum + entry.mood, 0) / total;
    
    // Calculate trend (last 7 days vs previous 7 days)
    const last7Days = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });
    
    const previous7Days = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 7 && daysDiff <= 14;
    });

    const recentAvg = last7Days.length > 0 
      ? last7Days.reduce((sum, entry) => sum + entry.mood, 0) / last7Days.length 
      : 0;
    const previousAvg = previous7Days.length > 0 
      ? previous7Days.reduce((sum, entry) => sum + entry.mood, 0) / previous7Days.length 
      : 0;

    const trend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    return { average, trend, total };
  }, [entries]);

  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return Frown;
    if (mood <= 7) return Meh;
    return Smile;
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'text-red-500';
    if (mood <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mood Insights</h1>
          <p className="text-gray-600">
            Track your emotional journey and discover patterns in your mental health
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900">
                  {moodStats.average.toFixed(1)}/10
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">7-Day Trend</p>
                <p className={`text-2xl font-bold ${moodStats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {moodStats.trend >= 0 ? '+' : ''}{moodStats.trend.toFixed(1)}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                moodStats.trend >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <TrendingUp className={`w-6 h-6 ${
                  moodStats.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{moodStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Trend Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Mood Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={4}
                  />
                  <YAxis 
                    domain={[1, 10]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [value ? value.toFixed(1) : 'No data', 'Mood']}
                    labelFormatter={(label) => {
                      const dataPoint = moodData.find(d => d.date === label);
                      return `${label} (${dataPoint?.entries || 0} entries)`;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Emotion Frequency Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Emotions</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionFrequency} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="emotion" 
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Mood Calendar */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Mood</h3>
          <div className="grid grid-cols-7 gap-2">
            {eachDayOfInterval({
              start: startOfWeek(new Date()),
              end: endOfWeek(new Date())
            }).map(date => {
              const dayEntry = entries.find(entry => 
                format(new Date(entry.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              );
              
              const mood = dayEntry?.mood || 0;
              const MoodIcon = getMoodIcon(mood);
              
              return (
                <div
                  key={format(date, 'yyyy-MM-dd')}
                  className={`p-4 rounded-lg text-center transition-all ${
                    isToday(date) ? 'bg-primary-100 border-2 border-primary-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {format(date, 'EEE')}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {format(date, 'd')}
                  </div>
                  {dayEntry ? (
                    <div className="space-y-1">
                      <MoodIcon className={`w-6 h-6 mx-auto ${getMoodColor(mood)}`} />
                      <div className="text-xs font-medium">{mood}/10</div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 mx-auto flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracker;