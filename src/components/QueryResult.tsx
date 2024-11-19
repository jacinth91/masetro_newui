import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface FinancialMetric {
  category: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  details?: string;
  source?: string;
}

interface QueryResultProps {
  metrics: FinancialMetric[];
  files?: string[];
}

const QueryResult: React.FC<QueryResultProps> = ({ metrics, files = [] }) => {
  // Comprehensive financial metrics
  const fileMetrics: FinancialMetric[] = [
    // Financial Performance
    {
      category: "Financial Performance",
      value: "Revenue: $20.4B",
      trend: "up",
      details: "8.5% YoY growth, driven by commercial segment",
      source: "q3-2024-earnings-report.pdf"
    },
    {
      category: "Financial Performance",
      value: "Operating Income: $3.2B",
      trend: "up",
      details: "15.2% margin, +200bps YoY",
      source: "q3-2024-earnings-report.pdf"
    },
    {
      category: "Financial Performance",
      value: "EPS: $1.42",
      trend: "up",
      details: "Beat consensus by $0.15",
      source: "q3-2024-earnings-report.pdf"
    },

    // Insurance Operations
    {
      category: "Insurance Operations",
      value: "Combined Ratio: 95.8%",
      trend: "down",
      details: "Improved from 97.2% in Q3 2023",
      source: "insurance-performance-q3.pdf"
    },
    {
      category: "Insurance Operations",
      value: "Written Premium: $12.8B",
      trend: "up",
      details: "8.5% growth in commercial lines",
      source: "insurance-performance-q3.pdf"
    },
    {
      category: "Insurance Operations",
      value: "Loss Ratio: 65.3%",
      trend: "neutral",
      details: "Stable year-over-year",
      source: "insurance-performance-q3.pdf"
    },

    // Investment Portfolio
    {
      category: "Investment Portfolio",
      value: "Investment Income: $1.2B",
      trend: "up",
      details: "12% increase from Q3 2023",
      source: "investment-analysis-q3.pdf"
    },
    {
      category: "Investment Portfolio",
      value: "Portfolio Yield: 4.2%",
      trend: "up",
      details: "+50bps from previous quarter",
      source: "investment-analysis-q3.pdf"
    },
    {
      category: "Investment Portfolio",
      value: "Fixed Income: 82%",
      trend: "neutral",
      details: "Of total investment portfolio",
      source: "investment-analysis-q3.pdf"
    },

    // Risk Metrics
    {
      category: "Risk Metrics",
      value: "Capital Ratio: 12.5%",
      trend: "up",
      details: "Well above regulatory requirements",
      source: "risk-assessment-q3-2024.pdf"
    },
    {
      category: "Risk Metrics",
      value: "Credit Quality",
      trend: "neutral",
      details: "96% investment grade holdings",
      source: "risk-assessment-q3-2024.pdf"
    },
    {
      category: "Risk Metrics",
      value: "Catastrophe Losses: $850M",
      trend: "down",
      details: "Below 5-year average",
      source: "risk-assessment-q3-2024.pdf"
    },

    // Market Position
    {
      category: "Market Position",
      value: "Market Share: 23.5%",
      trend: "up",
      details: "Leading position in commercial lines",
      source: "market-trend-analysis-2024.pdf"
    },
    {
      category: "Market Position",
      value: "Customer Retention: 92%",
      trend: "up",
      details: "+2% YoY improvement",
      source: "market-trend-analysis-2024.pdf"
    },
    {
      category: "Market Position",
      value: "Digital Adoption",
      trend: "up",
      details: "65% of claims filed digitally",
      source: "market-trend-analysis-2024.pdf"
    }
  ];

  // Filter metrics based on selected files
  const relevantMetrics = files.length > 0
    ? fileMetrics.filter(m => m.source && files.includes(m.source))
    : metrics.length > 0 ? metrics : fileMetrics;

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  // Group metrics by category
  const groupedMetrics = relevantMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, FinancialMetric[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-2">
      {Object.entries(groupedMetrics).map(([category, items], index) => (
        <div key={index} className={`${index > 0 ? 'border-t border-gray-100' : ''}`}>
          <div className="px-4 py-3 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">{category}</h3>
          </div>
          <div className="px-4 py-3 space-y-2">
            {items.map((metric, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <div className="mt-1">{getTrendIcon(metric.trend)}</div>
                <div className="flex-1">
                  <span className="text-sm text-gray-900">{metric.value}</span>
                  {metric.details && (
                    <span className="text-sm text-gray-500 ml-1">({metric.details})</span>
                  )}
                  {metric.source && (
                    <span className="text-xs text-blue-500 ml-2">
                      Source: {metric.source}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueryResult;