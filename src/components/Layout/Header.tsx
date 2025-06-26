import React from 'react';
import { Heart, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentPage,
  onPageChange,
  isMobileMenuOpen,
  onMobileMenuToggle
}) => {
  const navigationItems = [
    { id: 'journal', label: 'Journal', labelHi: 'डायरी', description: 'Write and reflect' },
    { id: 'chat', label: 'Chat', labelHi: 'चैट', description: 'AI companion' },
    { id: 'mood', label: 'Mood', labelHi: 'मूड', description: 'Track emotions' },
    { id: 'resources', label: 'Resources', labelHi: 'संसाधन', description: 'Get help' }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-indian-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mindful Journal</h1>
              <p className="text-xs text-gray-500 hidden sm:block">मानसिक स्वास्थ्य साथी</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-saffron-100 text-saffron-700 border border-saffron-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-500 font-devanagari">{item.labelHi}</div>
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    onMobileMenuToggle();
                  }}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-saffron-100 text-saffron-700 border border-saffron-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 font-devanagari">{item.labelHi}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;