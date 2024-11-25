import React from 'react';
import { TrendingUp, TrendingDown, LineChart } from 'lucide-react';

interface Suggestion {
  icon: React.ElementType;
  title: string;
  query: string;
}

interface SuggestedQueriesProps {
  selectedFileName?: string[];
  onQuerySelect: (query: string) => void;
}

const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ selectedFileName, onQuerySelect }) => {
  const defaultSuggestions: Suggestion[] = [
    { icon: TrendingUp, title: "Revenue Analysis", query: "What was the total revenue in Q3 2024?" },
    { icon: TrendingDown, title: "Interest Income", query: "How did net interest income perform?" },
    { icon: LineChart, title: "Segment Performance", query: "Show segment performance metrics" }
  ];

  const fileSpecificSuggestions: Suggestion[] = [
    { icon: TrendingUp, title: "File Summary", query: "Summarize the key points from this file" },
    { icon: TrendingDown, title: "Risk Analysis", query: "What are the main risks identified?" },
    { icon: LineChart, title: "Performance Metrics", query: "Show the key performance metrics" }
  ];

  const currentSuggestions = selectedFileName ? fileSpecificSuggestions : defaultSuggestions;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        {selectedFileName ? `Questions about ${selectedFileName}` : 'Suggested Queries'}
      </h3>
      <div className="space-y-2 mb-6">
        {currentSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onQuerySelect(suggestion.query)}
            className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 group"
          >
            <suggestion.icon className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                {suggestion.title}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQueries;