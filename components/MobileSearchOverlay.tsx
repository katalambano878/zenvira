'use client';

import { useState, useEffect } from 'react';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const popularSearches: string[] = [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 lg:hidden overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-lg"></i>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {!searchQuery && (
          <>
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Recent Searches</h3>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-xs text-blue-700 font-medium whitespace-nowrap"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-time-line text-gray-400"></i>
                        </div>
                        <span className="text-sm text-gray-700">{search}</span>
                      </div>
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-right-up-line text-gray-400"></i>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {popularSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors whitespace-nowrap"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recentSearches.length === 0 && popularSearches.length === 0 && (
              <div className="py-12 text-center">
                <i className="ri-search-line text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500 font-medium">Search your catalog</p>
                <p className="text-sm text-gray-400 mt-1">Suggestions appear when products are available</p>
              </div>
            )}
          </>
        )}

        {searchQuery && (
          <div className="py-12 text-center">
            <i className="ri-search-line text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500 font-medium">No suggestions yet</p>
            <p className="text-sm text-gray-400 mt-1">Add products to enable search results</p>
          </div>
        )}
      </div>
    </div>
  );
}
