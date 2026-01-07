import { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, Loader2, AlertCircle, Eye, EyeOff, Code2, FileText } from 'lucide-react';

interface AICorrectionPanelProps {
  exerciseType: 'Text Answer' | 'Code';
  question: string;
  onSubmit: (solution: string) => Promise<any>;
}

interface CorrectionResult {
  evaluation: string;
  score: number | null;
  perfectSolution: string;
}

export default function AICorrectionPanel({ exerciseType, question, onSubmit }: AICorrectionPanelProps) {
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState('');
  const [showPerfectSolution, setShowPerfectSolution] = useState(false);

  const handleSubmit = async () => {
    if (!solution.trim()) {
      setError('Please enter your solution first');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setCorrection(null);

    try {
      const result = await onSubmit(solution);
      if (result && result.correction) {
        setCorrection(result.correction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get AI correction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number | null) => {
    if (score === null) return null;
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b pb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI-Powered Correction</h3>
          <p className="text-sm text-gray-600">Get instant feedback on your solution</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Solution
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 text-gray-400">
              {exerciseType === 'Code' ? <Code2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder={
                exerciseType === 'Code'
                  ? 'Enter your code solution here...'
                  : 'Enter your answer here...'
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[200px] font-mono text-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !solution.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Get AI Correction</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {correction && (
          <div className="space-y-4 animate-fadeIn">
            {correction.score !== null && (
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getScoreIcon(correction.score)}
                    <div>
                      <p className="text-sm font-medium text-gray-600">Your Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(correction.score)}`}>
                        {correction.score}/100
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {correction.score >= 80 ? 'Excellent' : correction.score >= 60 ? 'Good' : 'Needs Work'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>AI Evaluation</span>
              </h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {correction.evaluation}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowPerfectSolution(!showPerfectSolution)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Perfect Solution</span>
                </div>
                {showPerfectSolution ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {showPerfectSolution && (
                <div className="p-6 bg-white border-t border-gray-200">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                    {correction.perfectSolution}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Powered by AI:</strong> This correction uses a local Qwen2.5 7B language model to evaluate your work and provide detailed feedback.
        </p>
      </div>
    </div>
  );
}

export { type CorrectionResult };
