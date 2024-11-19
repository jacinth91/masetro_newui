import React from 'react';
import { X, FileText, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

interface FileStatus {
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error' | 'summarizing';
  error?: string;
  progress?: number;
}

interface FileSummaryDialogProps {
  file: FileStatus | null;
  onClose: () => void;
}

const FileSummaryDialog: React.FC<FileSummaryDialogProps> = ({ file, onClose }) => {
  if (!file) return null;

  // Mock summary data - in a real app, this would come from your backend
  const summary = {
    keyPoints: [
      { title: "Revenue Growth", description: "12% YoY increase in Q3 2024", type: "positive" },
      { title: "Market Share", description: "Expanded by 2.5% in key markets", type: "positive" },
      { title: "Risk Factors", description: "Increased exposure in emerging markets", type: "warning" }
    ],
    metrics: [
      { label: "Total Revenue", value: "$5.2B", change: "+12%" },
      { label: "Operating Margin", value: "24.3%", change: "+1.5%" },
      { label: "Customer Base", value: "2.1M", change: "+8%" }
    ],
    recommendations: [
      "Focus on expanding digital transformation initiatives",
      "Consider strategic acquisitions in growing markets",
      "Strengthen risk management protocols"
    ]
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Key Points */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Key Points</h4>
              <div className="space-y-2">
                {summary.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getTypeColor(point.type)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {point.type === 'positive' ? (
                        <TrendingUp className="h-5 w-5 mt-0.5" />
                      ) : point.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 mt-0.5" />
                      ) : (
                        <BarChart3 className="h-5 w-5 mt-0.5" />
                      )}
                      <div>
                        <h5 className="font-medium">{point.title}</h5>
                        <p className="text-sm mt-1">{point.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Key Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                {summary.metrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metric.value}</p>
                    <p className={`text-sm mt-1 ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {summary.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 font-medium">•</span>
                    <span className="text-sm text-gray-600">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSummaryDialog;